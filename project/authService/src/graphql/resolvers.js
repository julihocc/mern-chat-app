// authService/src/graphql/resolvers.js
const {changePassword} = require('./mutations/changePassword');
const {login} = require('./mutations/login');
const {signUp} = require('./mutations/signUp');

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
    },
};

module.exports = { resolvers };