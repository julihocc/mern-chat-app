// contactService/src/graphql/mutations/changeUsername.js
const User = require('../../models/UserModel');
const {AuthenticationError} = require('apollo-server-express');
const {getUserFromToken, comparePassword} = require("../../utils/authentication")
const logger = require("../../utils/logger");
const {publishUserEvent} = require("../../utils/rabbitMQPublisher");

const changeUsername = async (_, args, context) => {
    const {newUsername, currentPassword} = args;
    logger.debug(`New Username: ${newUsername}`);
    const {token} = context;
    if (!token) {
        throw new AuthenticationError('You are not logged in');
    }
    const user = await getUserFromToken(token);
    if (!user) {
        throw new AuthenticationError('You are not logged in');
    }

    const match = await comparePassword(currentPassword, user.password);
    logger.debug(`Password match: ${match}`);
    if (!match) {
        throw new AuthenticationError('Invalid password. Not able to change username!');
    }

    if (!user) {
        throw new AuthenticationError('Not user found');
    }

    const existingUser = await User.findOne({username: newUsername});
    if (existingUser) {
        throw new Error('Username already taken');
    }

    try {
        logger.debug(`Updating username: ${user.username} to ${newUsername}`);
        await User.updateOne({username: user.username}, {$set: {username: newUsername}});
        await logger.debug(`Username updated to ${user.username}`);

        await publishUserEvent("contactService",'UsernameChanged', {
            id: user._id, oldUsername: user.username, newUsername: newUsername
        })
        await publishUserEvent("chatService",'UsernameChanged', {
            id: user._id, oldUsername: user.username, newUsername: newUsername
        })

        logger.debug(`Updated username: ${user.username} to ${newUsername}`);

        return await User.findOne({username: newUsername});
    } catch (err) {
        throw new Error(`Error updating username: ${err.message}`);
    }
}

module.exports = {changeUsername};
