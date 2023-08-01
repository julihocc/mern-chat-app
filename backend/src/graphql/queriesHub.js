// Path: backend\src\graphql\resolvers\queriesHub.js
// Describe the queriesHub that can be executed against the GraphQL schema

const { getMessagesByChatRoomId } = require('./queries/getMessagesByChatRoomId'); 
const { getChatRooms } = require('./queries/getChatRooms'); 
const { getCurrentUser } = require('./queries/getCurrentUser'); 
const { getUserById } = require('./queries/getUserById'); 
const { getContactRequestsByContext } = require("./queries/getContactRequestsByContext"); 
const { getContactRequests } = require("./queries/getContactRequests"); 
const { getChatRoom } = require("./queries/getChatRoom"); 
const { getUserByEmail } = require("./queries/getUserByEmail"); 
const { getUsersById } = require("./queries/getUsersById"); 
const { getContacts } = require("./queries/getContacts"); 
const { getContactsWithFullDetails } = require("./queries/getContactsWithFullDetails");

const queriesHub = {
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
    getContactsWithFullDetails
};

module.exports = queriesHub;
