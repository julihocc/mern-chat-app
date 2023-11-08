// authService/src/graphql/resolvers.js
const {changePassword} = require('./mutations/changePassword');
const {login} = require('./mutations/login');
const {signUp} = require('./mutations/signUp');
const {changeUsername} = require('./mutations/changeUsername');

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
        changeUsername
    },
};

module.exports = { resolvers };