// Path: contactService\src\graphql\resolvers.js
// Define the resolvers for the GraphQL schema

const subscriptions = require("./subscriptions");
const {GraphQLUpload} = require("graphql-upload");
// Mutations
const {acceptContactRequest} = require("./mutations/acceptContactRequest");
const {createChatRoom} = require("./mutations/createChatRoom");
const {
	createGroupConversation,
} = require("./mutations/createGroupConversation");
const {rejectContactRequest} = require("./mutations/rejectContactRequest");
const {sendContactRequest} = require("./mutations/sendContactRequest");
// Queries
const {getChatRooms} = require("./queries/getChatRooms");
const {getChatRoomUsers} = require("./queries/getChatRoomUsers");
const {getContactRequests} = require("./queries/getContactRequests");
const {
	getContactRequestsByContext,
} = require("./queries/getContactRequestsByContext");
const {getContacts} = require("./queries/getContacts");
const {
	getContactsWithFullDetails,
} = require("./queries/getContactsWithFullDetails");
const {getCurrentUser} = require("./queries/getCurrentUser");
const {getUserByEmail} = require("./queries/getUserByEmail");
const {getUserById} = require("./queries/getUserById");
const {getUsersById} = require("./queries/getUsersById");
const {
	getChatRoomsForCurrentUser,
} = require("./queries/getChatRoomsForCurrentUser");
const {getOneToOneChatRoom} = require("./queries/getOneToOneChatRoom");
const {
	getContactsWithChatRoom,
} = require("./queries/getContactsWithChatRoom");
const resolvers = {
	Upload: GraphQLUpload, Subscription: subscriptions, Mutation: {
		acceptContactRequest, createChatRoom, createGroupConversation, rejectContactRequest, sendContactRequest,
	}, Query: {
		getContactRequestsByContext,
		getCurrentUser,
		getUserByEmail,
		getUserById,
		getUsersById,
		getChatRoomsForCurrentUser,
		getContactsWithChatRoom,
	},
};

module.exports = {resolvers};
