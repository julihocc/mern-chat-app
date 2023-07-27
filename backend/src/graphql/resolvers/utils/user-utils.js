// path: backend\src\graphql\resolvers\utils\user-utils.js
const User = require('../../../models/User');
const logger = require('../../../logger'); // Import the logger

async function getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
        logger.error(`User not found with id: ${id}`); // Log this error
        throw new Error('User not found');
    }
    return user;
}

module.exports = { getUserById };
