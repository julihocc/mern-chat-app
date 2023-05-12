const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const saltRounds = 10;

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

module.exports = { encryptPassword, comparePassword, getUserFromToken };
