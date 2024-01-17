// contactService\src\graphql\resolvers\subscriptions.js
const logger = require("../utils/logger"); // Import the logger
const {PubSub} = require("graphql-subscriptions"); // Import the PubSub class from graphql-subscriptions



const subscriptions = {
	newMessage: {
		subscribe: (parent, {chatRoomId}, {pubSub}) => {
			return pubSub.asyncIterator(`NEW_MESSAGE_${chatRoomId}`);
		},
	},
	newContactRequest: {
		subscribe: (parent, args, {pubSub}) => {
			// const pubSub = new PubSub();
			return pubSub.asyncIterator("NEW_CONTACT_REQUEST");
		}
	}
};

module.exports = subscriptions;
