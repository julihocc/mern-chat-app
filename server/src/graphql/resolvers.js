const queries = require('./queries');
const mutations = require('./mutations');
const subscriptions = require('./subscriptions');

const resolvers = {
    Query: queries,
    Mutation: mutations,
    Subscription: subscriptions
};

module.exports = resolvers;
