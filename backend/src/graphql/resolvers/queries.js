// Path: backend\src\graphql\resolvers\queries.js
// Describe the queries that can be executed against the GraphQL schema

const {
    UserInputError, AuthenticationError
} = require("apollo-server-express");
const Message = require('../../models/Message');
const ChatRoom = require('../../models/ChatRoom');
const User = require('../../models/User');
const ContactRequest = require('../../models/ContactRequest');
const {getUserFromToken} = require('./utils/utils');
const logger = require('../../logger');

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
        return await ChatRoom.find({participantIds: user.id});
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

    getContactRequests: async (_, __, context) => {
        try {
            const user = await getUserFromToken(context.token);
            const contactRequests = await ContactRequest.find({recipientId: user.id})
            logger.info(`Contact requests fetched for user with id: ${user.id}`); // Log this info
            return contactRequests;
        } catch (err) {
            logger.error("Error loading contact requests: ", err); // Log the error
            throw new Error('Error fetching contact requests');
        }
    },

    getChatRoom: async (parent, {chatRoomId}) => {
        return await ChatRoom.findById(chatRoomId);
    },


    getUserByEmail: async (parent, {email}) => {
        return await User.findOne({email});
    },

    getUserByEmails: async (parent, {emails}) => {
        return await User.find({email: {$in: emails}});
    },

    getUsersById: async (parent, {userIds}) => {
        logger.info("Calling getUsersById", userIds)
        const users = await User.find({_id: {$in: userIds}});
        logger.info('users', !!users)
        return users;
    },

    getContacts: async (parent, args, context) => {
        logger.info("Calling getContacts")
        const {token} = context;
        logger.info('token', token)
        const user = await getUserFromToken(token);
        logger.info('user', !!user)
        if (!user) {
            throw new AuthenticationError('Invalid token');
        }

        // Find all contact requests related to the user which are accepted
        const contactRequests = await ContactRequest.find({
            $or: [{senderId: user.id}, {recipientId: user.id}],
            status: 'accepted'
        });

        logger.info(`Contacts fetched for user with id: ${user.id}`); // Log this info


        // Extract the user IDs from the contact requests
        const contactIdsFromRequests = contactRequests.map(request =>
            request.senderId.toString() === user.id ? request.recipientId : request.senderId
        );

        logger.info(`Contact IDs: ${contactIdsFromRequests}`); // Log this info

        // Fetch all contacts
        const userContacts = await User.find({_id: {$in: contactIdsFromRequests}}); // Fetch only 'email' field
        logger.info(`Contacts: ${userContacts}`); // Log this info

        logger.info('userContacts', !!userContacts)
        const contactEmails = userContacts.map(user => user.email); // Return the email addresses only
        logger.info(`Contact emails: ${contactEmails}`); // Log this info
        return userContacts;
    }

};

module.exports = queries;
