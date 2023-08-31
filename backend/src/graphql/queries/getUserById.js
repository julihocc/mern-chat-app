const logger = require("../../logger");
const User = require("../../models/UserModel");
 const getUserById = async (parent, {userId}) => {
    //logger.info("Calling getUserById", userId);
     //logger.info('user', !!user)
    return User.findById(userId);
}
module.exports = {getUserById};
