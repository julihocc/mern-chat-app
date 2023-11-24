// authService resolvers
const {login} = require('./mutations/login');
const {getCurrentUserCredentials} = require('./queries/getCurrentUserCredentials');
const {signUp} = require('./mutations/signUp');
const {changePassword} = require('./mutations/changePassword');
const {changeUsername} = require('./mutations/changeUsername');
const {logout} = require('./mutations/logout');
// chatService resolvers
const {getChatRoomById} = require('./queries/getChatRoomById');
const {getMessagesByChatRoomId} = require('./queries/getMessagesByChatRoomId');

const resolvers = {

	Query: {
		getCurrentUserCredentials, getChatRoomById, getMessagesByChatRoomId
	},

	Mutation: {
		login, signUp, changePassword, changeUsername, logout
	},
};

module.exports = {resolvers};