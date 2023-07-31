// path: backend\src\graphql\resolvers\hooks\user-hooksHub.js
const User = require('../../models/UserModel');
const logger = require('../../logger'); // Import the logger

async function getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
        logger.error(`User not found with id: ${id}`); // Log this error
        throw new Error('User not found');
    }
    return user;
}

module.exports = { getUserById };
