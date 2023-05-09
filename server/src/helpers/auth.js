const User = require('../models/User');
const jwt = require("jsonwebtoken");
require('dotenv').config();

async function getUserById(userId) {
    try {
        const user = await User.findById(userId);
        console.log('User found: ' + userId);
        console.log(user);
        return user;
    } catch (err) {
        console.error(err);
        console.log('User not found: ', userId);
        return null;
    }
}

const verifyToken = token => {
    console.log('verifyToken: ' + token);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, payload };
    } catch (err) {
        console.error(err);
        return { valid: false, payload: null };
    }
};

async function getUserFromHttpRequest(req) {
    const authorization = req.headers.authorization;
    console.log('authorization: ' + authorization);
    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.slice(7, authorization.length);
        console.log('- token: ' + token);
        const { valid, payload } = verifyToken(token);

        console.log('valid: ' + valid);
        if (valid) {
            console.log('Valid token');
            console.log('payload: ' + JSON.stringify(payload));
            console.log('payload.id: ' + payload.id);

            const expirationDate = new Date(payload.exp * 1000);
            console.log('expirationDate:' + expirationDate);

            const user = await getUserById(payload.id);
            return { user };
        } else {
            throw new Error('Invalid token');
        }
    }
    return {};
}

module.exports = {
    getUserById,
    verifyToken,
    getUserFromHttpRequest,
};
