// UserController.js
const User = require('../models/UserModel');
const {comparePassword, getUserFromToken} = require('../utils/authentication');
const {debug} = require("../utils/logger");

const getUserByEmail = async (req, res) => {
	try {
		const email = req.params.email;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: `Server error: ${error}` });
	}
};

const getPasswordComparison = async (req, res) => {
	try {
	const { password, hashed } = req.body;
	const result = await comparePassword(password, hashed);
	debug(`comparePassword: ${JSON.stringify(result)}`);
	res.json(result);
	} catch (error) {
		res.status(500).json({ message: `Server error: ${error}` });
	}
}

module.exports = {
	getUserByEmail,
	getPasswordComparison
};
