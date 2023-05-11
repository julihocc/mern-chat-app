const signUp = require('./signUp');
const login = require('./login');
const sendContactRequest = require('./sendContactRequest');
const acceptContactRequest = require('./acceptContactRequest');
const rejectContactRequest = require('./rejectContactRequest');
const createChatRoom = require('./createChatRoom');
const sendMessage = require('./sendMessage');
const createGroupConversation = require('./createGroupConversation');

const mutations = {
    signUp,
    login,
    sendContactRequest,
    acceptContactRequest,
    rejectContactRequest,
    createChatRoom,
    sendMessage,
    createGroupConversation
};

module.exports = mutations;
