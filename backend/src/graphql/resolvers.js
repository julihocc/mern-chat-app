// Path: backend\src\graphql\resolvers.js
// Define the resolvers for the GraphQL schema

const queries = require('./queriesHub');
const mutations = require('./mutationsHub');
const subscriptions = require('./subscriptionsHub');
const { GraphQLUpload } = require('graphql-upload');

const resolvers = {
    Upload: GraphQLUpload,
    Query: queries,
    Mutation: mutations,
    Subscription: subscriptions
};

module.exports = resolvers;
