// UserController.js
const User = require('../models/UserModel');
const {comparePassword, retrieveUserByToken, encryptPassword} = require('../utils/authentication');
const {debug} = require("../utils/logger");
const {sign} = require("jsonwebtoken");
const {publishUserEvent} = require("../utils/rabbitMQPublisher");

const getUserByEmail = async (req, res) => {
	debug("getUserByEmail")
	try {
		const email = req.body.email;
		debug(`email: ${email}`);
		const user = await User.findOne({email});
		res.json(user);
		return user;
	} catch (error) {
		res.status(500).json({message: `getUserByEmail error: ${error}`});
	}
};

const getPasswordComparison = async (req, res) => {
	try {
		const {password, hashed} = req.body;
		const result = await comparePassword(password, hashed);
		debug(`comparePassword: ${JSON.stringify(result)}`);
		res.json(result);
		return result;
	} catch (error) {
		res.status(500).json({message: `getPasswordComparison error: ${error}`});
	}
}

const getTokenByPayload = async (req, res) => {
	try {
		const {id, email} = req.body;
		const payload = {id, email};
		const token = sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});
		debug(`token: ${token}`);
		res.json({token});
		return token;
	} catch (error) {
		res.status(500).json({message: `getTokenByPayload error: ${error}`});
	}
}

const getUserByToken = async (req, res) => {
	try {
		const {token} = req.body;
		const user = await retrieveUserByToken(token);
		debug(`user: ${JSON.stringify(user)}`);
		res.json(user);
		return user;
	} catch (error) {
		res.status(500).json({message: `getUserByToken error: ${error}`});
	}
}

const getUserByUsername = async (req, res) => {
	try {
        const username = req.body.username;
        debug(`username: ${username}`);
        const user = await User.findOne({username});
        res.json(user);
        return user;
    } catch (error) {
        res.status(500).json({message: `getUserByUsername error: ${error}`});
    }
}

const getPasswordEncrypted = async (req, res) => {
	try {
        const {password} = req.body;
        const hashedPassword = await encryptPassword(password);
        debug(`hashedPassword: ${hashedPassword}`);
        res.json({hashedPassword});
        return hashedPassword;
    } catch (error) {
        res.status(500).json({message: `getPasswordEncrypted error: ${error}`});
    }
}

const createUser = async (req, res) => {
	try {
        const {email, username, password} = req.body;
        const hashedPassword = await encryptPassword(password);
        const user = new User({email, username, password: hashedPassword});
        await user.save();
		// await publishUserEvent("contactService", "UserCreated", {
        //     id: user._id, email: user.email, username: user.username,
        // });
		// await publishUserEvent("chatService", "UserCreated", {
        //     id: user._id, email: user.email, username: user.username,
        // });
        res.json(user);
        return user;
    } catch (error) {
        res.status(500).json({message: `createUser error: ${error}`});
    }
}

const changePassword = async (req, res) => {
	try {
		const {email, password} = req.body;
		await User.updateOne({email}, {$set: {password: await encryptPassword(password)}});
		const updatedUser = await User.findOne({email});
		debug(`Updated user: ${JSON.stringify(updatedUser)}`);
		res.json(updatedUser);
		return updatedUser;
	} catch (error) {
		res.status(500).json({message: `changePassword error: ${error}`});
	}
}

module.exports = {
	getUserByEmail, getPasswordComparison, getTokenByPayload, getUserByToken, getUserByUsername, getPasswordEncrypted, createUser, changePassword
};
