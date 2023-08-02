const logger = require("../../logger");
const User = require("../../models/UserModel");
 const getUserById = async (parent, {userId}) => {
    //logger.info("Calling getUserById", userId);
    const user = User.findById(userId);
    //logger.info('user', !!user)
    return user;
}
module.exports = {getUserById};
