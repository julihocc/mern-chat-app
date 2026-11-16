// UserController.js
const User = require('../models/UserModel');
const {retrieveUserByToken, encryptPassword} = require('../utils/authentication');
const {debug} = require("../utils/logger");
const {sign} = require("jsonwebtoken");
const {validatePassword} = require('../utils/passwordValidator')

const toPublicUser = (user) => {
	if (!user) {
		return user;
	}
	const obj = typeof user.toObject === "function" ? user.toObject() : {...user};
	delete obj.password;
	return obj;
};

const getTokenByPayload = async (req, res) => {
	debug("getTokenByPayload");
	const {id, email} = req.query;
	const payload = {id, email};
	try {
		const token = sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});
		res.json({token});
		return token;
	} catch (error) {
		res.status(500).json({message: `getTokenByPayload error: ${error}`});
	}
}

const createUser = async (req, res) => {
	try {
		const {email, username, password} = req.body;

		const passwordValidationResult = validatePassword(password)
		if (!passwordValidationResult.isValid) {
			return res.status(400).json({message: passwordValidationResult.message})
		}

		const hashedPassword = await encryptPassword(password);
		const user = new User({email, username, password: hashedPassword});
		await user.save();
		res.json(toPublicUser(user));
		return user;
	} catch (error) {
		res.status(500).json({message: `createUser error: ${error}`});
	}
}
const getManyUsersByEmail = async (req, res) => {
	debug("getManyUsersByEmail")
	const {emails} = req.query;
	debug(`emails: ${emails}`);
	const emailsAsArray = emails.split(",");
	debug(`emailsAsArray: ${emailsAsArray}`);
	try {
		const otherUsers = await User.find({email: {$in: emailsAsArray}}).select("-password");
		res.json(otherUsers);
		return otherUsers;
	} catch (error) {
		res.status(500).json({message: `getManyUsersByEmail error: ${error}`});
	}
}

const getUser = async (req, res) => {
	debug("UserController | getUser")
	const {userId, email, username} = req.query;
	const token = req.get("authorization") || req.query.token;

	if (userId) {
		debug(`User id: ${userId}`);
		try {
			const user = await User.findById(userId).select("-password");
			res.json(user);
			return user;
		} catch (error) {
			res.status(500).json({message: `getUserById error: ${error}`});
		}
	}
	if (token) {
		try {
			const user = await retrieveUserByToken(token);
			res.json(user);
			return user;
		} catch (error) {
			res.status(500).json({message: `getUserByToken error: ${error}`});
		}
	}
	if (email) {
		debug(`email: ${email}`);
		try {
			const user = await User.findOne({email}).select("-password");
			res.json(user);
			return user;
		} catch (error) {
			res.status(500).json({message: `getUserByEmail error: ${error}`});
		}
	}

	if (username) {
		debug(`username: ${username}`);
		try {
			const user = await User.findOne({username}).select("-password");
			res.json(user);
			return user;
		} catch (error) {
			res.status(500).json({message: `getUserByUsername error: ${error}`});
		}
	}
}

const updateUser = async (req, res) => {
	debug("UserController | updateUser")
	const {username, newUsername, userId, contactId} = req.body;
	debug(`username: ${username}`);
	debug(`newUsername: ${newUsername}`);
	debug(`userId: ${userId}`);
	debug(`contactId: ${contactId}`);

	if (username && newUsername) {
		debug(`Changing username from ${username} to ${newUsername}`);
		try {
			await User.updateOne({username}, {$set: {username: newUsername}});
			const user = await User.findOne({username: newUsername}).select("-password");

			res.json(user);
			return user;
		} catch (error) {
			res.status(500).json({message: `updateUser error: ${error}`});
		}
	}

	if (userId && contactId) {
		debug(`Adding new contact ${contactId} to user ${userId}`)
		try {
			const user = await User.findById(userId).select("-password");
			if (!user.contacts) {
				user.contacts = [];
			}
			// if(!user.contacts.includes(contactId)){
			// 	user.contacts.push(contactId);
			// }
			user.contacts.push(contactId);
			debug(`Updated user: ${JSON.stringify(user)}`);
			await user.save();
			res.json(user)
			res.status(200);
			return user;
		} catch (error) {
			res.status(500).json({message: `updateUser error: ${error}`});
		}
	}
}

const getContactsByUserId = async (req, res) => {
	debug("UserController | getContactsByUserId")
	const {userId} = req.query;
	debug(`userId: ${userId}`);
	try {
		const user = await User.findById(userId).select("-password");
		const contacts = await User.find({_id: {$in: user.contacts}}).select("-password");
		res.json(contacts);
		return contacts;
	} catch (error) {
		res.status(500).json({message: `getContactsByUserId error: ${error}`});
	}
}

module.exports = {
	getTokenByPayload, createUser, getManyUsersByEmail, getUser, updateUser, getContactsByUserId,
};
