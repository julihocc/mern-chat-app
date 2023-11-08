// backend/src/graphql/mutations/changeUsername.js
const User = require('../../models/UserModel');
const {AuthenticationError} = require('apollo-server-express');
const {getUserFromToken} = require("../../utils/authentication")
const logger = require("../../utils/logger");
const {publishUserEvent} = require("../../utils/rabbitMQPublisher");

const changeUsername = async (_, args, context) => {
    const {newUsername} = args;
    logger.debug(`New Username: ${newUsername}`);
    const {token} = context;
    if (!token) {
        throw new AuthenticationError('You are not logged in');
    }
    const user = await getUserFromToken(token);

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

        await publishUserEvent(
            'UsernameChanged',
            {
                id: user._id,
                oldUsername: user.username,
                newUsername: newUsername
            })

        logger.debug(`Updated username: ${user.username} to ${newUsername}`);

        return await User.findOne({username: newUsername});
    } catch (err) {
        throw new Error(`Error updating username: ${err.message}`);
    }
}

module.exports = {changeUsername};
