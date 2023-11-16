const logger = require("../../utils/logger");
const User = require("../../models/UserModel");
const getUserById = async (parent, {userId}) => {

	return User.findById(userId);
};
module.exports = {getUserById};
