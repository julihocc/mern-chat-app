// const logger = require("../../logger");
const User = require("../../../mongodb/models/UserModel");
 const getUserById = async (parent, {userId}) => {
    //logger.debug("Calling getUserById", userId);
     //logger.debug('user', !!user)
    return User.findById(userId);
}
module.exports = {getUserById};
