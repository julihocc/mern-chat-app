// authService/src/graphql/resolvers.js
const {changePassword} = require('./mutations/changePassword');
const {login} = require('./mutations/login');
const {signUp} = require('./mutations/signUp');
const { GraphQLUpload } = require("graphql-upload");

const resolvers = {
    Upload: GraphQLUpload,
    Mutation: {
        changePassword,
        login,
        signUp,
    },
};

module.exports = { resolvers };