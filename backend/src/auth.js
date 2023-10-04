// path: backend\src\auth.js

const User = require('./models/UserModel');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const logger = require('./logger'); // Import the logger

async function getUserById(userId) {
    try {
        const user = await User.findById(userId);
        //logger.debug('User found: ' + userId); // Log the info
        //logger.debug(user);
        return user;
    } catch (err) {
        logger.error(err); // Log the error
        //logger.debug('User not found: ', userId); // Log the info
        return null;
    }
}

const verifyToken = token => {
    //logger.debug('verifyToken: ' + token); // Log the info
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, payload };
    } catch (err) {
        logger.error(err); // Log the error
        return { valid: false, payload: null };
    }
};

module.exports = {
    getUserById,
    verifyToken,
};
