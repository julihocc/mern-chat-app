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
        console.log("Calling getChatRooms")
        // console.log('context', context)
        const {token} = context;
        console.log('token', token)

        if (!token) {
            throw new AuthenticationError('You must be logged in');
        }

        const user = await getUserFromToken(token);
        console.log('user', !!user)

        // Check if the user is logged in
        if (!user) {
            throw new AuthenticationError('You must be logged in');
        }

        // Fetch all chat rooms where the user is a participant
        return await ChatRoom.find({participantIds: user.id});
    },

    getCurrentUser: async (parent, args, context) => {
        console.log("Calling getCurrentUser")
        const {token} = context;
        console.log('token', token)

        if (!token) {
            throw new AuthenticationError('You must be logged in');
        }

        const user = await getUserFromToken(token);
        console.log('user', !!user)

        if (!user) {
            throw new AuthenticationError('Invalid token');
        }

        return user;
    },

    getUserById: async (parent, {userId}) => {
        console.log("Calling getUserById", userId);
        const user = User.findById(userId);
        console.log('user', !!user)
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
        console.log("Calling getUsersById", userIds)
        const users = await User.find({_id: {$in: userIds}});
        console.log('users', !!users)
        return users;
    }
};

module.exports = queries;
