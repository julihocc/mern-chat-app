// Path: backend\src\graphql\resolvers\queries.js
// Describe the queries that can be executed against the GraphQL schema

const {
    UserInputError, AuthenticationError
} = require("apollo-server-express");
const Message = require('../models/MessageModel');
const ChatRoom = require('../models/ChatRoomModel');
const User = require('../models/UserModel');
const ContactRequest = require('../models/ContactRequestModel');
const {getUserFromToken} = require('./utils/utils');
const logger = require('../logger');

const queries = {

    getMessagesByChatRoomId: async (parent, args) => {
        const {chatRoomId} = args;
        const messages = await Message.find({chatRoomId});
        if (!messages) {
            throw new UserInputError('Messages not found');
        }
        return messages;
    },

    getChatRooms: async (parent, args, context) => {
        logger.info("Calling getChatRooms")
        // logger.info('context', context)
        const {token} = context;
        logger.info('token', token)

        if (!token) {
            throw new AuthenticationError('You must be logged in');
        }

        const user = await getUserFromToken(token);
        logger.info('user', !!user)

        // Check if the user is logged in
        if (!user) {
            throw new AuthenticationError('You must be logged in');
        }

        // Fetch all chat rooms where the user is a participant
        return ChatRoom.find({participantIds: user.id});
    },

    getCurrentUser: async (parent, args, context) => {
        logger.info("Calling getCurrentUser")
        const {token} = context;
        logger.info('token', token)

        if (!token) {
            throw new AuthenticationError('You must be logged in');
        }

        const user = await getUserFromToken(token);
        logger.info('user', !!user)

        if (!user) {
            throw new AuthenticationError('Invalid token');
        }

        return user;
    },

    getUserById: async (parent, {userId}) => {
        logger.info("Calling getUserById", userId);
        const user = User.findById(userId);
        logger.info('user', !!user)
        return user;
    },

    getContactRequestsByContext: async (parent, args, context) => {
        logger.info("Calling getContactRequests")
        const {token} = context;
        logger.info(token)

        if (!token) {
            throw new AuthenticationError('You must be logged in');
        }

        const recipient = await getUserFromToken(token);
        logger.info('user', !!recipient)

        // Check if the user is logged in
        if (!recipient) {
            throw new AuthenticationError('You must be logged in');
        }

        logger.info(recipient)
        logger.info(recipient.id)
        // Fetch all contact requests where the user is the recipient
        const contactRequest = ContactRequest.find({recipientId: recipient.id});
        logger.info(!!contactRequest)
        if (!contactRequest) {
            throw new Error('Contact requests not found');
        }
        return contactRequest;

    },
    getContactRequests: async (_, {userId}, __) => {

        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found')
        }

        try {
            const contactRequests = await ContactRequest.find({recipientId: userId})
            logger.info(`Contact requests fetched for user with id: ${userId}`); // Log this info
            return contactRequests;
        } catch (err) {
            logger.error("Error loading contact requests: ", err); // Log the error
            throw new Error('Error fetching contact requests');
        }
    },

    getChatRoom: async (parent, {chatRoomId}) => {
        return ChatRoom.findById(chatRoomId);
    },


    getUserByEmail: async (parent, {email}) => {
        return User.findOne({email});
    },

    getUsersById: async (parent, {userIds}) => {
        logger.info("Calling getUsersById", userIds)
        const users = await User.find({_id: {$in: userIds}});
        logger.info('users', !!users)
        return users;
    },

    getContacts: async (parent, {userId}, context) => {
        logger.info("Calling getContacts")
        logger.info(userId)
        const user = await User.findById(userId);
        if (!user) {
            throw new UserInputError('User not found');
        }
        if (!user.contacts) {
            throw new UserInputError('Contacts not found');
        }
        logger.info(user.contacts)
        return user.contacts;
    }

};

module.exports = queries;
