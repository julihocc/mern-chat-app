// Path: backend\src\graphql\resolversHub.js
// Define the resolversHub for the GraphQL schema

const subscriptions = require('./subscriptions');
const { GraphQLUpload } = require('graphql-upload');
// Mutations
const { acceptContactRequest } = require("./resolvers/mutations/acceptContactRequest");
const { createChatRoom } = require("./resolvers/mutations/createChatRoom");
const { createGroupConversation } = require("./resolvers/mutations/createGroupConversation");
const { login } = require("./resolvers/mutations/login");
const { rejectContactRequest } = require("./resolvers/mutations/rejectContactRequest");
const { sendContactRequest } = require("./resolvers/mutations/sendContactRequest");
const { signUp } = require("./resolvers/mutations/signUp");
const { sendMessage } = require("./resolvers/mutations/sendMessage");
// Queries
const  { getChatRoomById } = require("./resolvers/queries/getChatRoomById");
const { getChatRoomUsers } = require("./resolvers/queries/getChatRoomUsers");
const { getContactRequests } = require("./resolvers/queries/getContactRequests");
const { getContactRequestsByContext } = require("./resolvers/queries/getContactRequestsByContext");
const { getContacts } = require("./resolvers/queries/getContacts");
const { getContactsWithFullDetails } = require("./resolvers/queries/getContactsWithFullDetails");
const { getCurrentUser } = require("./resolvers/queries/getCurrentUser");
const { getMessagesByChatRoomId } = require("./resolvers/queries/getMessagesByChatRoomId");
const { getUserByEmail } = require("./resolvers/queries/getUserByEmail");
const { getUserById } = require("./resolvers/queries/getUserById");
const { getUsersById } = require("./resolvers/queries/getUsersById");
const { getChatRooms } = require("./resolvers/queries/getChatRooms");


const resolversHub = {
    Upload: GraphQLUpload,
    Subscription: subscriptions,
    Mutation: {
        acceptContactRequest,
        createChatRoom,
        createGroupConversation,
        login,
        rejectContactRequest,
        sendContactRequest,
        signUp,
        sendMessage
    },
    Query: {
        getChatRoomById,
        getChatRoomUsers,
        getContactRequests,
        getContactRequestsByContext,
        getContacts,
        getContactsWithFullDetails,
        getCurrentUser,
        getMessagesByChatRoomId,
        getUserByEmail,
        getUserById,
        getUsersById,
        getChatRooms
    }
};

module.exports = resolversHub;
