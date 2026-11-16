const {GraphQLError} = require("graphql");
const {withFilter} = require("graphql-subscriptions");
const pubSub = require("../utils/pubsub");

function unauthenticated() {
	return new GraphQLError("You must be logged in", {
		extensions: {code: "UNAUTHENTICATED"},
	});
}

function sameId(left, right) {
	if (left == null || right == null) {
		return false;
	}
	const leftId = left._id || left;
	const rightId = right._id || right;
	return String(leftId) === String(rightId);
}

function includesId(list, id) {
	return Array.isArray(list) && list.some((item) => sameId(item, id));
}

function requireUser(context) {
	if (!context.userId) {
		throw unauthenticated();
	}
}

const subscriptions = {
	newMessage: {
		subscribe: withFilter(
			(_parent, args, context) => {
				requireUser(context);
				if (!args.chatRoomId) {
					throw new GraphQLError("chatRoomId is required", {
						extensions: {code: "BAD_USER_INPUT"},
					});
				}
				return pubSub.asyncIterator("NEW_MESSAGE");
			},
			async (payload, args, context) => {
				const message = payload && payload.newMessage;
				if (!message || !sameId(message.chatRoomId, args.chatRoomId)) {
					return false;
				}
				const room = await context.dataSources.chatAPI.getChatRoomById(args.chatRoomId);
				return Boolean(room && includesId(room.participantIds, context.userId));
			}
		),
	},
	newContactRequest: {
		subscribe: withFilter(
			(_parent, _args, context) => {
				requireUser(context);
				return pubSub.asyncIterator("NEW_CONTACT_REQUEST");
			},
			(payload, _args, context) => {
				const request = payload && payload.newContactRequest;
				return Boolean(request && sameId(request.recipientId, context.userId));
			}
		),
	},
	newContact: {
		subscribe: withFilter(
			(_parent, _args, context) => {
				requireUser(context);
				return pubSub.asyncIterator("NEW_CONTACT");
			},
			(payload, _args, context) => {
				const contact = payload && payload.newContact;
				if (!contact) {
					return false;
				}
				return sameId(contact.senderId, context.userId) || sameId(contact.recipientId, context.userId);
			}
		),
	},
	newChatRoom: {
		subscribe: withFilter(
			(_parent, _args, context) => {
				requireUser(context);
				return pubSub.asyncIterator("NEW_CHAT_ROOM");
			},
			(payload, _args, context) => {
				const chatRoom = payload && payload.newChatRoom;
				return Boolean(chatRoom && includesId(chatRoom.participantIds, context.userId));
			}
		),
	},
};

module.exports = subscriptions;
