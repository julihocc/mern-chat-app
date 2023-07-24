// backend\src\graphql\resolvers\subscriptions.js


const subscriptions = {
    newMessage: {
        subscribe: (parent, { chatRoomId }, { pubSub }) => {
            console.log('loading newMessage')
            console.log('newMessage: ', chatRoomId)
            return pubSub.asyncIterator(`NEW_MESSAGE_${chatRoomId}`);
        }
    }
};

module.exports = subscriptions;
