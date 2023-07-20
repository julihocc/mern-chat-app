// backend\src\graphql\resolvers\subscriptions.js

// const { PubSub } = require('graphql-subscriptions');
// const pubSub = new PubSub()

const subscriptions = {
    messageAdded: {
        subscribe: (_, {chatRoomId}, {pubSub}) => {
            return pubSub.asyncIterator(`MESSAGE_ADDED_${chatRoomId}`)
        }
    }
};

module.exports = subscriptions;
