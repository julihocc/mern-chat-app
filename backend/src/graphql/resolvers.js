const queries = require('./resolvers/queries');
const mutations = require('./resolvers/mutations');
const subscriptions = require('./resolvers/subscriptions');

const resolvers = {
    Query: queries,
    Mutation: mutations,
    Subscription: subscriptions
};

module.exports = resolvers;
