const signUp = require('./mutations/signUp');
const login = require('./mutations/login');
const sendContactRequest = require('./mutations/sendContactRequest');
const acceptContactRequest = require('./mutations/acceptContactRequest');
const rejectContactRequest = require('./mutations/rejectContactRequest');
const createChatRoom = require('./mutations/createChatRoom');
const sendMessage = require('./mutations/sendMessage');
const createGroupConversation = require('./mutations/createGroupConversation');

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
