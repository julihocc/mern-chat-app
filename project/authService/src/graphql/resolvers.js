// authService/src/graphql/resolvers.js
const {changePassword} = require('./mutations/changePassword');
const {login} = require('./mutations/login');
const {signUp} = require('./mutations/signUp');

const resolvers = {
    AuthMutation: {
        changePassword,
        login,
        signUp,
    },
};

module.exports = { resolvers };