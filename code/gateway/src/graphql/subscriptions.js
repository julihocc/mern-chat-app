// contactService\src\graphql\resolvers\subscriptions.js
const logger = require("../utils/logger"); // Import the logger

const subscriptions = {
	newMessage: {
		subscribe: (parent, {chatRoomId}, {pubSub}) => {
			return pubSub.asyncIterator(`NEW_MESSAGE_${chatRoomId}`);
		},
	},
};

module.exports = subscriptions;
