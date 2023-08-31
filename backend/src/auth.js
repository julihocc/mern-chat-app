// path: backend\src\auth.js

const User = require('./models/UserModel');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const logger = require('./logger'); // Import the logger

async function getUserById(userId) {
    try {
        //logger.info('User found: ' + userId); // Log the info
        //logger.info(user);
        return await User.findById(userId);
    } catch (err) {
        logger.error(err); // Log the error
        //logger.info('User not found: ', userId); // Log the info
        return null;
    }
}

const verifyToken = token => {
    //logger.info('verifyToken: ' + token); // Log the info
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
