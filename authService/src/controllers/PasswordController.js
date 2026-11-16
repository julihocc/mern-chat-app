const User = require('../models/UserModel');
const {comparePassword, encryptPassword} = require('../utils/authentication');

const toPublicUser = (user) => {
	if (!user) {
		return user;
	}
	const obj = typeof user.toObject === "function" ? user.toObject() : {...user};
	delete obj.password;
	return obj;
};

const changePassword = async (req, res) => {
	try {
		const {email, password} = req.body;
		await User.updateOne({email}, {$set: {password: await encryptPassword(password)}});
		const updatedUser = await User.findOne({email}).select("-password");
		res.json(toPublicUser(updatedUser));
	} catch (error) {
		res.status(500).json({message: `changePassword error: ${error}`});
	}
}

const comparePasswords = async (req, res) => {
	const {email, password} = req.body || {};
	if (!email || !password) {
		return res.status(400).json({message: "email and password are required"});
	}
	try {
		const user = await User.findOne({email});
		if (!user) {
			return res.json({match: false});
		}
		const match = await comparePassword(password, user.password);
		res.json({match});
	} catch (error) {
		res.status(500).json({message: `comparePasswords error: ${error}`});
	}
}

module.exports = {
	changePassword, comparePasswords
}
