// contactService\src\graphql\resolvers\subscriptions.js
const logger = require("../utils/logger"); // Import the logger

const subscriptions = {
	newMessage: {
		subscribe: (parent, {chatRoomId}, {pubSub}) => {
			return pubSub.asyncIterator(`NEW_MESSAGE_${chatRoomId}`);
		},
	}, // Add this new subscription
	friendRequestUpdated: {
		subscribe: (parent, {userId}, {pubSub}) => {
			return pubSub.asyncIterator(`FRIEND_REQUEST_UPDATED_${userId}`);
		},
	},
};

module.exports = subscriptions;
