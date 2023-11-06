// backend\src\graphql\resolvers\mutations\signUp.js

const {UserInputError} = require("apollo-server-express");
const User = require("./UserModel");
const jwt = require("jsonwebtoken");
const {encryptPassword} = require("../graphql/utils");
const logger = require("../logger");

const signUp = async (_, {email, username, password, confirmPassword}, context,) => {
    // Check if email already exists
    const existingUserByEmail = await User.findOne({email});
    if (existingUserByEmail) {
        logger.error("Email already in use");
        throw new UserInputError("Email already in use");
    }

    const existingUserByUsername = await User.findOne({username});
    if (existingUserByUsername) {
        logger.error("Username already in use");
        throw new UserInputError("Username already in use");
    }

    if (password !== confirmPassword) {
        logger.error("Passwords don't match");
        throw new UserInputError("Passwords don't match");
    }

    const hashedPassword = await encryptPassword(password);
    const user = new User({email, username, password: hashedPassword});

    try {
        await user.save();
        //logger.debug(`User created with id: ${user.id}`); // Log this info
    } catch (err) {
        logger.error(`Failed to save user: ${err}`); // Log this error
    }

    const token = jwt.sign({
        id: user.id, email: user.email,
    }, process.env.JWT_SECRET, {expiresIn: "1h"},);

    context.res.cookie('authToken', token, {
        httpOnly: true, maxAge: 3600000, sameSite: 'lax'
    });

    return {token, user};
};

module.exports = {signUp};
