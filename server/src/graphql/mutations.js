const signUp = require('./signUp');
const login = require('./login');
const sendContactRequest = require('./sendContactRequest');
const acceptContactRequest = require('./acceptContactRequest');
const rejectContactRequest = require('./rejectContactRequest');
const createChatRoom = require('./createChatRoom');
const sendMessage = require('./sendMessage');

const mutations = {
    signUp,
    login,
    sendContactRequest,
    acceptContactRequest,
    rejectContactRequest,
    createChatRoom,
    sendMessage
};

module.exports = mutations;
