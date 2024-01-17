// project/gateway/src/graphql/resolvers.js
// authService
const { login } = require("./mutations/login");
const { getCurrentUser } = require("./queries/getCurrentUser");
const { signUp } = require("./mutations/signUp");
const { changePassword } = require("./mutations/changePassword");
const { changeUsername } = require("./mutations/changeUsername");
const { logout } = require("./mutations/logout");
const {
  getContactsWithChatRoom,
} = require("./queries/getContactsWithChatRoom");
const { getUserById } = require("./queries/getUserById");
// chatService resolvers
const { getChatRoomById } = require("./queries/getChatRoomById");
const {
  getMessagesByChatRoomId,
} = require("./queries/getMessagesByChatRoomId");
const { sendMessage } = require("./mutations/sendMessage");
const {
  createGroupConversationForCurrentUser,
} = require("./mutations/createGroupConversationForCurrentUser");
const {
  getChatRoomsForCurrentUser,
} = require("./queries/getChatRoomsForCurrentUser");
// contactService resolvers
const { sendContactRequest } = require("./mutations/sendContactRequest");
const { acceptContactRequest } = require("./mutations/acceptContactRequest");
const { rejectContactRequest } = require("./mutations/rejectContactRequest");
const {
  getContactRequestsByContext,
} = require("./queries/getContactRequestsByContext");
const { getContactRequests } = require("./queries/getContactRequests");
// testing integration
const { getUserByEmail } = require("./queries/getUserByEmail");
const { getManyUsersByEmail } = require("./queries/getManyUsersByEmail");
const { GraphQLUpload } = require("graphql-upload");
const subscriptions = require("./subscriptions");
const { PubSub } = require("graphql-subscriptions");

const pubSub = new PubSub();

const resolvers = {
  Upload: GraphQLUpload,
  // Subscription: subscriptions,
  Query: {
    getCurrentUser,
    getChatRoomById,
    getMessagesByChatRoomId,
    getUserByEmail,
    getManyUsersByEmail,
    getChatRoomsForCurrentUser,
    getContactRequestsByContext,
    getContactsWithChatRoom,
    getContactRequests,
    getUserById,
  },

  Mutation: {
    login,
    signUp,
    changePassword,
    changeUsername,
    logout,
    sendMessage,
    createGroupConversationForCurrentUser,
    sendContactRequest,
    acceptContactRequest,
    rejectContactRequest,
  },

  Subscription: {
    newMessage: {
      subscribe: () => pubSub.asyncIterator(`NEW_MESSAGE`)
    },
    newContactRequest: {
      subscribe: () => pubSub.asyncIterator("NEW_CONTACT_REQUEST")    
    },
  },
};

module.exports = { resolvers };
