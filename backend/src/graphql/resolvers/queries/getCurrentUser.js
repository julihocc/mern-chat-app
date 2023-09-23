const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../../../utils/authUtils");
 const getCurrentUser= async (_, args, context) => {
    const {token} = context;

    if (!token) {
        throw new AuthenticationError('You must be logged in');
    }

    const user = await getUserFromToken(token);

    if (!user) {
        throw new AuthenticationError('Invalid token');
    }

    return user;
}
module.exports = {getCurrentUser};
