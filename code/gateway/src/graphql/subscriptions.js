// contactService\src\graphql\resolvers\subscriptions.js
const logger = require("../utils/logger"); // Import the logger
const { PubSub } = require("graphql-subscriptions"); // Import the PubSub class from graphql-subscriptions
const pubSub = require("../utils/pubsub"); // Import the pubsub instance from utils/pubsub.js
// const pubSub = new PubSub();

const subscriptions = {
	newMessage: {
		subscribe: (parent, args, context) => {
			const {chatRoomId} = args;
			return pubSub.asyncIterator(`NEW_MESSAGE_${chatRoomId}`);
		},
	},
	newContactRequest: {
		subscribe: (parent, args, context) => {
			// const pubSub = new PubSub();
			logger.debug(`subscriptions.js | newContactRequest`);
			return pubSub.asyncIterator("NEW_CONTACT_REQUEST");
		}
	},
	newContact: {
		subscribe: (parent, args, context) => {
			return pubSub.asyncIterator(`NEW_CONTACT`);
		}
	},
};

module.exports = subscriptions;
