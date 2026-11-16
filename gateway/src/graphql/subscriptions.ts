const {GraphQLError} = require("graphql");
const {withFilter} = require("graphql-subscriptions");
const pubSub = require("../utils/pubsub");

function unauthenticated() {
	return new GraphQLError("You must be logged in", {
		extensions: {code: "UNAUTHENTICATED"},
	});
}

function sameId(left: any, right: any) {
	if (left == null || right == null) {
		return false;
	}
	const leftId = left._id || left;
	const rightId = right._id || right;
	return String(leftId) === String(rightId);
}

function includesId(list: any, id: any) {
	return Array.isArray(list) && list.some((item) => sameId(item, id));
}

function requireUser(context: any) {
	if (!context.userId) {
		throw unauthenticated();
	}
}

const subscriptions = {
	newMessage: {
		subscribe: withFilter(
			(_parent: any, args: any, context: any) => {
				requireUser(context);
				if (!args.chatRoomId) {
					throw new GraphQLError("chatRoomId is required", {
						extensions: {code: "BAD_USER_INPUT"},
					});
				}
				return pubSub.asyncIterator("NEW_MESSAGE");
			},
			async (payload: any, args: any, context: any) => {
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
			(_parent: any, _args: any, context: any) => {
				requireUser(context);
				return pubSub.asyncIterator("NEW_CONTACT_REQUEST");
			},
			(payload: any, _args: any, context: any) => {
				const request = payload && payload.newContactRequest;
				return Boolean(request && sameId(request.recipientId, context.userId));
			}
		),
	},
	newContact: {
		subscribe: withFilter(
			(_parent: any, _args: any, context: any) => {
				requireUser(context);
				return pubSub.asyncIterator("NEW_CONTACT");
			},
			(payload: any, _args: any, context: any) => {
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
			(_parent: any, _args: any, context: any) => {
				requireUser(context);
				return pubSub.asyncIterator("NEW_CHAT_ROOM");
			},
			(payload: any, _args: any, context: any) => {
				const chatRoom = payload && payload.newChatRoom;
				return Boolean(chatRoom && includesId(chatRoom.participantIds, context.userId));
			}
		),
	},
};

module.exports = subscriptions;
