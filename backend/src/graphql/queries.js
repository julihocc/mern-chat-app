// Path: backend\src\graphql\resolvers\queries.js
// Describe the queries that can be executed against the GraphQL schema

const { getMessagesByChatRoomId } = require('./queries/getMessagesByChatRoomId'); // Converted to CommonJS
const { getChatRooms } = require('./queries/getChatRooms'); // Converted to CommonJS
const { getCurrentUser } = require('./queries/getCurrentUser'); // Converted to CommonJS
const { getUserById } = require('./queries/getUserById'); // Converted to CommonJS
const { getContactRequestsByContext } = require("./queries/getContactRequestsByContext"); // Converted to CommonJS
const { getContactRequests } = require("./queries/getContactRequests"); // Converted to CommonJS
const { getChatRoom } = require("./queries/getChatRoom"); // Converted to CommonJS
const { getUserByEmail } = require("./queries/getUserByEmail"); // Converted to CommonJS
const { getUsersById } = require("./queries/getUsersById"); // Converted to CommonJS
const { getContacts } = require("./queries/getContacts"); // Converted to CommonJS

const queries = {
    getMessagesByChatRoomId,
    getChatRooms,
    getCurrentUser,
    getUserById,
    getContactRequestsByContext,
    getContactRequests,
    getChatRoom,
    getUserByEmail,
    getUsersById,
    getContacts,
};

module.exports = queries;
