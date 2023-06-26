const User = require('../../../models/User');

async function getUserById(id) {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    return user;
}

module.exports = { getUserById };
