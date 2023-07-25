// Path: backend\src\graphql\resolvers.js
// Define the resolvers for the GraphQL schema
const queries = require('./resolvers/queries');
const mutations = require('./resolvers/mutations');
const subscriptions = require('./resolvers/subscriptions');
const { GraphQLUpload } = require('graphql-upload');

const resolvers = {
    Upload: GraphQLUpload,
    Query: queries,
    Mutation: mutations,
    Subscription: subscriptions
};

module.exports = resolvers;
