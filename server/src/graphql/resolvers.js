// src/graphql/resolvers.js
// noinspection UnnecessaryLocalVariableJS


const {
    AuthenticationError, UserInputError
} = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const ContactRequest = require('../models/ContactRequest');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const {PubSub} = require('graphql-subscriptions');

const pubSub = new PubSub()
const encryptPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
}

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

const getUserFromToken = (token) => {
    console.log("Calling getUserFromToken")
    console.log('token', token)
    const tokenString = token.split(' ')[1];
    try {
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
        console.log('decoded', decoded)
        return User.findById(decoded.id);
    } catch (err) {
        console.log("Error in getUserFromToken")
        console.error(err);
        return null;
    }
};


const resolvers = {


    Query: {

        getMessagesByChatRoomId: async (parent, args, context) => {
            const {chatRoomId} = args;
            const messages = await Message.find({chatRoomId});
            if (!messages) {
                throw new UserInputError('Messages not found');
            }
            return messages;
        },

        getMessageById: async (parent, args, context) => {
            const {messageId} = args;
            const message = await Message.findById(messageId);
            if (!message) {
                throw new UserInputError('Message not found');
            }
            return message;
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
            const chatRooms = await ChatRoom.find({participantIds: user.id});
            return chatRooms;
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

        getContactRequests: async (_, {userId}, context) => {
            try {
                const contactRequests = await ContactRequest.find({recipientId: userId})
                // .populate('senderId')
                // .populate('recipientId');
                console.log('contactRequests', new Date(), contactRequests)
                return contactRequests;
            } catch (err) {
                console.error("Error loading contact requests: ", err);
                throw new Error('Error fetching contact requests');
            }
        },

        getChatRoom: async (parent, {chatRoomId}, context) => {
            const chatRoom = await ChatRoom.findById(chatRoomId);
            return chatRoom;
        },


        getUserByEmail: async (parent, {email}) => {
            const user = await User.findOne({email});
            return user;
        },

        getChatRoomsByUserId: async (parent, {userId}) => {
            const chatRooms = await ChatRoom.find({participantIds: userId});
            return chatRooms;
        }
    },

    Mutation: {
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


    },

    Subscription: {
        messageAdded: {
            subscribe: (_, {chatRoomId}, {pubSub}) => {
                return pubSub.asyncIterator(`MESSAGE_ADDED_${chatRoomId}`)
            }
        }
    },
};
module.exports = resolvers;