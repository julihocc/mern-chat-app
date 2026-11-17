const {GraphQLError} = require("graphql");
const {AuthenticationError, UserInputError} = require("../utils/graphqlErrors");
const pubSub = require("../utils/pubsub");
const access = require("../school/access");
const {buildRephraseInput, buildReplyInput} = require("../school/prompts");
const {complete} = require("../school/xai");

function forbidden(message: string) {
	return new GraphQLError(message, {extensions: {code: "FORBIDDEN"}});
}

function filePayload(file: string) {
	const marker = ";base64,";
	const index = String(file || "").indexOf(marker);
	return index >= 0 ? String(file).slice(index + marker.length) : String(file || "");
}

async function loadViewer(context: any) {
	if (!context.token) {
		throw new AuthenticationError("You must be logged in");
	}
	const user = await context.dataSources.authAPI.getUserByToken(context.token);
	if (!user) {
		throw new AuthenticationError("There is no user associated with this token");
	}
	const memberships = await context.dataSources.contactAPI.listMemberships(user._id);
	return {
		user,
		viewer: {
			userId: String(user._id),
			email: user.email,
			expertGroupIds: (memberships || []).map((item: any) => String(item.groupId)),
		},
	};
}

function messageAuthor(message: any) {
	if (message.senderId && message.senderId.username) {
		return message.senderId.username;
	}
	return "person";
}

function senderIdOf(message: any) {
	if (message.senderId && message.senderId._id) {
		return String(message.senderId._id);
	}
	return String(message.senderId);
}

const schoolGroups = async (_parent: any, _args: any, context: any) => {
	await loadViewer(context);
	return context.dataSources.contactAPI.listGroups();
};

const canCreateSchoolGroup = async (_parent: any, _args: any, context: any) => {
	const {viewer} = await loadViewer(context);
	return access.canCreateGroup(viewer, process.env.BOOTSTRAP_EXPERT_EMAIL);
};

const myExpertGroups = async (_parent: any, _args: any, context: any) => {
	const {viewer} = await loadViewer(context);
	const groups = await context.dataSources.contactAPI.listGroups();
	return (groups || []).filter((group: any) => access.canSeeWaiting(viewer, group._id));
};

const waitingConversations = async (_parent: any, args: any, context: any) => {
	const {viewer} = await loadViewer(context);
	if (!args.groupId) {
		throw new UserInputError("groupId is required");
	}
	if (!access.canSeeWaiting(viewer, args.groupId)) {
		throw forbidden("You cannot see waiting questions for this course or office");
	}
	const rooms = await context.dataSources.chatAPI.listWaitingRooms(args.groupId);
	const items = [];
	for (const room of rooms || []) {
		const student = await context.dataSources.authAPI.getUserById(room.studentId);
		items.push({
			_id: room._id,
			groupId: args.groupId,
			question: room.question,
			username: student && student.username ? student.username : "student",
			open: true,
		});
	}
	return items;
};

const createSchoolGroup = async (_parent: any, args: any, context: any) => {
	const {viewer} = await loadViewer(context);
	if (!access.canCreateGroup(viewer, process.env.BOOTSTRAP_EXPERT_EMAIL)) {
		throw forbidden("You cannot create a course or an office");
	}
	if (!args.name || !["course", "office"].includes(args.kind)) {
		throw new UserInputError("A group needs a name and a kind of course or office");
	}
	const group = await context.dataSources.contactAPI.createGroup(args.name, args.kind, viewer.userId);
	await context.dataSources.contactAPI.addMembership(viewer.userId, group._id);
	return group;
};

const addExpert = async (_parent: any, args: any, context: any) => {
	const {viewer} = await loadViewer(context);
	if (!access.canAddExpert(viewer, args.groupId)) {
		throw forbidden("You cannot add an expert to this course or office");
	}
	const person = await context.dataSources.authAPI.getUserByEmail(args.email);
	if (!person) {
		throw new UserInputError("No account uses that email");
	}
	await context.dataSources.contactAPI.addMembership(person._id, args.groupId);
	return context.dataSources.contactAPI.getGroup(args.groupId);
};

const startSchoolConversation = async (_parent: any, args: any, context: any) => {
	const {user, viewer} = await loadViewer(context);
	if (!args.groupId || !args.body || !String(args.body).trim()) {
		throw new UserInputError("A question needs a course or office and some text");
	}
	const group = await context.dataSources.contactAPI.getGroup(args.groupId);
	if (!group || !group._id) {
		throw new UserInputError("That course or office does not exist");
	}
	const room = await context.dataSources.chatAPI.startSchoolRoom(viewer.userId, args.groupId, args.body);
	pubSub.publish("WAITING_CONVERSATION", {
		waitingConversation: {
			_id: room._id,
			groupId: args.groupId,
			question: String(args.body).trim(),
			username: user.username,
			open: true,
		},
	});
	return room;
};

const takeSchoolConversation = async (_parent: any, args: any, context: any) => {
	const {viewer} = await loadViewer(context);
	const room = await context.dataSources.chatAPI.getChatRoomById(args.chatRoomId);
	if (!room) {
		throw new UserInputError("That conversation does not exist");
	}
	if (!access.canTake(viewer, room.groupId, room.status)) {
		throw forbidden("You cannot take this question");
	}
	const updated = await context.dataSources.chatAPI.claimSchoolRoom(args.chatRoomId, viewer.userId);
	pubSub.publish("WAITING_CONVERSATION", {
		waitingConversation: {
			_id: room._id,
			groupId: room.groupId,
			question: "",
			username: "",
			open: false,
		},
	});
	pubSub.publish("NEW_CHAT_ROOM", {newChatRoom: updated});
	return updated;
};

const suggestQuestionWording = async (_parent: any, args: any, context: any) => {
	await loadViewer(context);
	if (!args.draft || !String(args.draft).trim()) {
		throw new UserInputError("There is no draft to make clearer");
	}
	const group = await context.dataSources.contactAPI.getGroup(args.groupId);
	if (!group || !group.name) {
		throw new UserInputError("That course or office does not exist");
	}
	return complete(buildRephraseInput(String(args.draft), group.name));
};

const suggestReply = async (_parent: any, args: any, context: any) => {
	const {viewer} = await loadViewer(context);
	const room = await context.dataSources.chatAPI.getChatRoomById(args.chatRoomId);
	if (!room || !access.canProposeReply(viewer, room)) {
		throw forbidden("You cannot ask for a reply in this conversation");
	}
	const messages = await context.dataSources.chatAPI.getMessagesByChatRoomId(args.chatRoomId);
	const query = (messages || []).map((message: any) => message.body || "").join("\n").slice(0, 2000);
	const excerpts = query.trim()
		? await context.dataSources.chatAPI.searchKnowledge(room.groupId, query)
		: [];
	const built = buildReplyInput(
		(messages || []).map((message: any) => ({author: messageAuthor(message), body: message.body})),
		excerpts || [],
	);
	if (!built) {
		return {proposal: null, nothingToSuggest: true, excerpts: []};
	}
	const proposal = await complete(built);
	return {
		proposal,
		nothingToSuggest: false,
		excerpts: (excerpts || []).map((excerpt: any) => excerpt.text),
	};
};

const uploadSchoolDocument = async (_parent: any, args: any, context: any) => {
	const {viewer} = await loadViewer(context);
	const schoolWide = Boolean(args.schoolWide);
	if (schoolWide) {
		if (!access.canUploadSchoolDocument(viewer)) {
			throw forbidden("You cannot add a school-wide document");
		}
	} else if (!access.canUploadGroupDocument(viewer, args.groupId)) {
		throw forbidden("You cannot add a document to this course or office");
	}
	const lower = String(args.filename || "").toLowerCase();
	if (!lower.endsWith(".txt") && !lower.endsWith(".md") && !lower.endsWith(".pdf")) {
		throw new UserInputError("Only .txt, .md, and .pdf files are accepted");
	}
	const payload = filePayload(args.file);
	const bytes = Buffer.from(payload, "base64").length;
	if (!bytes || bytes > 5 * 1024 * 1024) {
		throw new UserInputError("The file must contain text and be 5 MB or smaller");
	}
	await context.dataSources.chatAPI.saveDocument(
		args.filename,
		schoolWide ? "school" : "group",
		schoolWide ? null : args.groupId,
		payload,
		viewer.userId,
	);
	return true;
};

const markAnswer = async (_parent: any, args: any, context: any) => {
	const {viewer} = await loadViewer(context);
	const message = await context.dataSources.chatAPI.getMessage(args.messageId);
	if (!message) {
		throw new UserInputError("That message does not exist");
	}
	const room = await context.dataSources.chatAPI.getChatRoomById(message.chatRoomId);
	if (!room || !access.canProposeReply(viewer, room) || !access.canMark(viewer, senderIdOf(message))) {
		throw forbidden("You can keep only a reply you sent in a conversation you took");
	}
	const messages = await context.dataSources.chatAPI.getMessagesByChatRoomId(message.chatRoomId);
	const ordered = [...(messages || [])].sort(
		(left: any, right: any) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
	);
	const index = ordered.findIndex((item: any) => String(item._id) === String(message._id));
	let question = null;
	for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
		if (senderIdOf(ordered[cursor]) !== viewer.userId) {
			question = ordered[cursor];
			break;
		}
	}
	if (!question || !question.body) {
		throw new UserInputError("There is no student question to keep with this answer");
	}
	await context.dataSources.chatAPI.saveMarkedAnswer(
		room.groupId,
		question.body,
		message.body,
		message._id,
		viewer.userId,
	);
	return true;
};

module.exports = {
	Query: {schoolGroups, myExpertGroups, canCreateSchoolGroup, waitingConversations},
	Mutation: {
		createSchoolGroup,
		addExpert,
		startSchoolConversation,
		takeSchoolConversation,
		suggestQuestionWording,
		suggestReply,
		uploadSchoolDocument,
		markAnswer,
	},
};
