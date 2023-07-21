// backend\src\graphql\resolvers\subscriptions.js

// const { PubSub } = require('graphql-subscriptions');
// const pubSub = new PubSub()

const subscriptions = {
    messageAdded: {
        subscribe: (_, {chatRoomId}, {pubSub}) => {
            return pubSub.asyncIterator(`MESSAGE_ADDED_${chatRoomId}`)
        }
    },
    newMessage: {
        subscribe: (parent, { chatRoomId }, { pubSub }) => {
            console.log('loading newMessage')
            console.log('newMessage: ', chatRoomId)
            return pubSub.asyncIterator(`NEW_MESSAGE_${chatRoomId}`);
        }
    }
};

module.exports = subscriptions;
