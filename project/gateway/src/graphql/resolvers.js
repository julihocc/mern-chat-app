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
const {sendMessage} = require('./mutations/sendMessage');
const {createGroupConversationForCurrentUser} = require('./mutations/createGroupConversationForCurrentUser');
const {getChatRoomsForCurrentUser} = require('./queries/getChatRoomsForCurrentUser');
// contactService resolvers
const {sendContactRequest} = require('./mutations/sendContactRequest');
const {acceptContactRequest} = require('./mutations/acceptContactRequest');
const {rejectContactRequest} = require('./mutations/rejectContactRequest');
// testing integration
const {getUserByEmail} = require('./queries/getUserByEmail');
const {getManyUsersByEmail} = require('./queries/getManyUsersByEmail');

const resolvers = {

	Query: {
		getCurrentUserCredentials,
		getChatRoomById,
		getMessagesByChatRoomId,
		getUserByEmail,
		getManyUsersByEmail,
		getChatRoomsForCurrentUser,
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
		rejectContactRequest
	},
};

module.exports = {resolvers};