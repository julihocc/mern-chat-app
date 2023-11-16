// contactService\src\graphql\resolvers\subscriptions.js
const logger = require("../utils/logger"); // Import the logger

const subscriptions = {
  newMessage: {
    subscribe: (parent, { chatRoomId }, { pubSub }) => {
      //logger.debug('loading newMessage'); // Log the info
      //logger.debug(`newMessage: ${chatRoomId}`); // Log the info
      return pubSub.asyncIterator(`NEW_MESSAGE_${chatRoomId}`);
    },
  },
  // Add this new subscription
  friendRequestUpdated: {
    subscribe: (parent, { userId }, { pubSub }) => {
      //logger.debug('loading friendRequestUpdated'); // Log the info
      //logger.debug(`friendRequestUpdated: ${userId}`); // Log the info
      return pubSub.asyncIterator(`FRIEND_REQUEST_UPDATED_${userId}`);
    },
  },
};

module.exports = subscriptions;
