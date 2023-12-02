// UserController.js
const User = require('../models/UserModel');
const {retrieveUserByToken, encryptPassword} = require('../utils/authentication');
const {debug} = require("../utils/logger");
const {sign} = require("jsonwebtoken");

// const getUserByEmail = async (req, res) => {
// 	debug("authService/getUserByEmail")
// 	try {
// 		// const email = req.body.email;
// 		const email = req.query.email;
// 		debug(`authService/email: ${email}`);
// 		const user = await User.findOne({email});
// 		debug(`authService/user: ${JSON.stringify(user)}`);
// 		res.json(user);
// 		return user;
// 	} catch (error) {
// 		res.status(500).json({message: `getUserByEmail error: ${error}`});
// 	}
// };


const getTokenByPayload = async (req, res) => {
	debug("getTokenByPayload");
	const {id, email} = req.query;
	debug(`id: ${id}`);
	debug(`email: ${email}`);
	const payload = {id, email};
	debug(`payload: ${JSON.stringify(payload)}`);
	try {
		const token = sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});
		debug(`token: ${token}`);
		res.json({token});
		return token;
	} catch (error) {
		res.status(500).json({message: `getTokenByPayload error: ${error}`});
	}
}

// const getUserByToken = async (req, res) => {
// 	debug("getUserByToken");
// 	// const {token} = req.body;
// 	const {token} = req.query;
// 	debug(`token: ${token}`);
// 	debug(`JWT_SECRET: ${process.env.JWT_SECRET}`);
// 	try {
// 		const user = await retrieveUserByToken(token);
// 		debug(`user: ${JSON.stringify(user)}`);
// 		res.json(user);
// 		return user;
// 	} catch (error) {
// 		res.status(500).json({message: `getUserByToken error: ${error}`});
// 	}
// }

// const getUserByUsername = async (req, res) => {
// 	try {
// 		// const username = req.body.username;
// 		const {username} = req.query;
// 		debug(`username: ${username}`);
// 		const user = await User.findOne({username});
// 		res.json(user);
// 		return user;
// 	} catch (error) {
// 		res.status(500).json({message: `getUserByUsername error: ${error}`});
// 	}
// }


const createUser = async (req, res) => {
	try {
		const {email, username, password} = req.body;
		const hashedPassword = await encryptPassword(password);
		const user = new User({email, username, password: hashedPassword});
		await user.save();
		res.json(user);
		return user;
	} catch (error) {
		res.status(500).json({message: `createUser error: ${error}`});
	}
}
// const changeUsername = async (req, res) => {
// 	try {
// 		debug("changeUsername")
// 		const {username, newUsername} = req.body;
// 		debug(`username: ${username}`);
// 		debug(`newUsername: ${newUsername}`);
// 		// const user = await User.findOneAndUpdate({username}, {$set: {username: newUsername}});
// 		await User.updateOne({username}, {$set: {username: newUsername}});
// 		const user = await User.findOne({username: newUsername});
// 		debug(`Updated user: ${JSON.stringify(user)}`);
//
// 		res.json(user);
// 		return user;
// 	} catch (error) {
// 		res.status(500).json({message: `changeUsername error: ${error}`});
// 	}
// }

const getManyUsersByEmail = async (req, res) => {
	debug("getManyUsersByEmail")
	const {emails} = req.query;
	debug(`emails: ${emails}`);
	const emailsAsArray = emails.split(",");
	debug(`emailsAsArray: ${emailsAsArray}`);
	try {
		const otherUsers = await User.find({email: {$in: emailsAsArray}});
		debug(`otherUsers: ${JSON.stringify(otherUsers)}`);
		res.json(otherUsers);
		return otherUsers;
	} catch (error) {
		res.status(500).json({message: `getManyUsersByEmail error: ${error}`});
	}
}

const getUser = async (req, res) => {
	debug("UserController | getUser")
	const {userId, email, token, username} = req.query;

	if (userId) {
		debug(`User id: ${userId}`);
        try {
            const user = await User.findById(userId);
            debug(`user: ${JSON.stringify(user)}`);
            res.json(user);
            return user;
        } catch (error) {
            res.status(500).json({message: `getUserById error: ${error}`});
        }
	}
	if (token) {
		debug(`token: ${token}`);
		debug(`JWT_SECRET: ${process.env.JWT_SECRET}`);
		try {
			const user = await retrieveUserByToken(token);
			debug(`user: ${JSON.stringify(user)}`);
			res.json(user);
			return user;
		} catch (error) {
			res.status(500).json({message: `getUserByToken error: ${error}`});
		}
	}
	if (email) {
		debug(`email: ${email}`);
        try {
            const user = await User.findOne({email});
            debug(`user: ${JSON.stringify(user)}`);
            res.json(user);
            return user;
        } catch (error) {
            res.status(500).json({message: `getUserByEmail error: ${error}`});
        }
	}

	if (username) {
		debug(`username: ${username}`);
        try {
            const user = await User.findOne({username});
            debug(`user: ${JSON.stringify(user)}`);
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

	if(username&&newUsername){
		debug(`Changing username from ${username} to ${newUsername}`);
		try{
			await User.updateOne({username}, {$set: {username: newUsername}});
            const user = await User.findOne({username: newUsername});
            debug(`Updated user: ${JSON.stringify(user)}`);

            res.json(user);
            return user;
		} catch (error) {
			res.status(500).json({message: `updateUser error: ${error}`});
		}
	}

	if(userId&&contactId){
		debug(`Adding new contact ${contactId} to user ${userId}`)
		try{
			const user = await User.findById(userId);
			debug(`user: ${JSON.stringify(user)}`);
			if(!user.contacts){
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

module.exports = {
	// getUserByEmail,
	getTokenByPayload,
	// getUserByToken,
	// getUserByUsername,
	createUser,
	// changeUsername,
	getManyUsersByEmail,
	getUser,
	updateUser,
};
