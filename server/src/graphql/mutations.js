const {
    UserInputError, AuthenticationError
} = require("apollo-server-express");
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { encryptPassword, comparePassword } = require('./utils');
const ContactRequest = require("../models/ContactRequest");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

const mutations = {
    signUp: async (parent, {email, password}) => {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            throw new UserInputError('Email already in use');
        }
        const hashedPassword = await encryptPassword(password)
        const user = new User({email: email, password: hashedPassword});
        await user.save();
        const token = jwt.sign({
            id: user.id, email: user.email
        }, process.env.JWT_SECRET, {expiresIn: '1h'});
        return {token, user};
    },

    login: async (parent, {email, password}) => {
        console.log("\nCalling login\na")
        const user = await User.findOne({email});
        if (!user) {
            throw new Error('Invalid email');
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            throw new Error('Invalid password');
        }
        const payload = {id: user._id, email: user.email};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});
        // return {token, user};
        return {
            token, user
        };
    },

    sendContactRequest: async (parent, {senderId, recipientId}) => {

        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        if (!sender) {
            throw new Error("Sender not found");
        }

        if (!recipient) {
            throw new Error("Recipient not found");
        }

        try {
            const contactRequest = new ContactRequest({
                senderId: sender.id,
                recipientId: recipient.id,
                status: 'pending'
            });
            await contactRequest.save();

            return contactRequest;
        } catch (err) {
            console.error(err);
            throw new Error("Failed to send contact request");
        }
    },

    acceptContactRequest: async (parent, {senderId, recipientId}) => {

        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);


        if (!sender) {
            throw new Error('Sender not found')
        }

        if (!recipient) {
            throw new Error('Recipient not found')
        }

        const contactRequest = await ContactRequest.findOne({
            senderId: sender.id, recipientId: recipient.id
        });

        if (!contactRequest) {
            throw new Error('Contact request not found');
        }


        try {

            contactRequest.status = 'accepted';
            await contactRequest.save();

            const chatRoom = new ChatRoom({
                participantIds: [contactRequest.senderId, contactRequest.recipientId],
                messagesIds: []
            });

            await chatRoom.save();

            contactRequest.chatRoomId = chatRoom.id;
            await contactRequest.save();


            return contactRequest;
        } catch (err) {
            console.error(err)
        }

    },

    rejectContactRequest: async (parent, {senderId, recipientId}) => {

        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        if (!sender) {
            throw new Error('Sender not found')
        }

        if (!recipient) {
            throw new Error('Recipient not found')
        }

        const contactRequest = await ContactRequest.findOne({
            senderId: sender.id, recipientId: recipient.id
        });

        if (!contactRequest) {
            throw new Error('Contact request not found');
        }

        contactRequest.status = 'rejected';
        await contactRequest.save();

        return contactRequest;
    },

    async createChatRoom(_, {participantIds}) {
        const participants = await User.find({_id: {$in: participantIds}});

        if (participants.length !== participantIds.length) {
            throw new Error('Some participantIds not found');
        }

        const chatRoom = new ChatRoom({participants});
        await chatRoom.save();

        return chatRoom;
    },

    sendMessage: async (parent, {senderId, chatRoomId,  body}) => {

        const sender = await User.findById(senderId);

        if (!sender) {
            throw new AuthenticationError('sendMessage: Not logged in');
        }



        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom) {
            console.error('Chat room not found');
            throw new Error('Chat room not found');
        }

        const message = new Message({
            senderId: sender.id,
            chatRoomId: chatRoom.id,
            body: body,
        });
        await message.save();

        // Publish the new message
        await pubSub.publish(`MESSAGE_ADDED_${chatRoom.id}`, {messageAdded: message});

        return message;
    },
};

module.exports = mutations;
