// contactService\src\graphqlChatService\resolvers\subscriptions.js


const subscriptions = {
	newMessage: {
		subscribe: (parent, {chatRoomId}, {pubSub}) => {
			return pubSub.asyncIterator(`NEW_MESSAGE_${chatRoomId}`);
		},
	},
};

module.exports = subscriptions;
