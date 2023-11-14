// authService/src/graphql/resolvers.js
const {changePassword} = require('./mutations/changePassword');
const {login} = require('./mutations/login');
const {signUp} = require('./mutations/signUp');
const {changeUsername} = require('./mutations/changeUsername');
const {logout} = require('./mutations/logout');

const resolvers = {

    Query: {
        me: () => {
            return 'Hello World!';
        }
    },

    Mutation: {
        changePassword,
        login,
        signUp,
        changeUsername,
        logout,
    },
};

module.exports = { resolvers };