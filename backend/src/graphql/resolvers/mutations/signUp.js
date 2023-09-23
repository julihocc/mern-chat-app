// backend\src\graphql\resolvers\mutations\signUp.js

const {UserInputError} = require("apollo-server-express");
const User = require('../../../mongodb/models/UserModel');
const jwt = require('jsonwebtoken');
const {encryptPassword} = require('../../../utils/authUtils');
const logger = require('../../../utils/logger');

const signUp = async (_, {email, username, password, confirmPassword}) => {

    // Check if email is valid
    const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;
    if (!email.match(emailValidation)) {
        logger.error('Email format is incorrect. Please provide a valid email address'); // Log this error
        throw new UserInputError('Email format is incorrect. Please provide a valid email address');
    }

    const existingUserByEmail = await User.findOne({email});
    if (existingUserByEmail) {
        throw new UserInputError('Email already in use');
    }

    const existingUserByUsername = await User.findOne({username});
    if (existingUserByUsername) {
        throw new UserInputError('Username already in use');
    }

    if (password !== confirmPassword) {
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
        id: user.id, email: user.email
    }, process.env.JWT_SECRET, {expiresIn: '1h'});

    return {token, user};
};

module.exports = {signUp};
