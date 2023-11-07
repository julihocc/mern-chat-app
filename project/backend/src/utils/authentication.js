// backend\src\graphql\resolvers\hooks\hooksHub.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../../backend/src/models/UserModel");
// const logger = require("../logger");
const saltRounds = 10;

const encryptPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

const getUserFromToken = async (token) => {
    // logger.debug(`getUserFromToken: ${token}`)
    const tokenString = token.split(" ")[1];
    // logger.debug(`tokenString: ${tokenString}`)
    // logger.debug(`JWT_SECRET: ${process.env.JWT_SECRET}`)
    try {
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
        // logger.debug(`decoded: ${JSON.stringify(decoded)}`)
        const user = await User.findById(decoded.id);
        // logger.debug(`user: ${JSON.stringify(user)}`)
        return user;
    } catch (err) {
        // logger.error("Error in getUserFromToken", err);
        throw new Error(err);
    }
};

module.exports = { encryptPassword, comparePassword, getUserFromToken };
