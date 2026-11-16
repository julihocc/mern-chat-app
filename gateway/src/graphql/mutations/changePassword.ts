const {
	AuthenticationError, UserInputError,
} = require("../../utils/graphqlErrors");
const logger = require("../../utils/logger");

const changePassword = async (_: any, {oldPassword, newPassword}: any, context: any) => {
	if (oldPassword === newPassword) {
		throw new UserInputError("New password cannot be the same as old password");
	}

	const {token} = context;

	if (!token) {
		throw new AuthenticationError("You must be logged in");
	}

	// const user = await getUserFromToken(token);
	const user = await context.dataSources.authAPI.getUserByToken(token);

	if (!user) {
		throw new AuthenticationError("User not found");
	} else {
		logger.debug(`User found: ${user.email} (${user.id})`);
	}

	const isPasswordValid = await context.dataSources.authAPI.getPasswordComparison(user.email, oldPassword);

	if (!isPasswordValid) {
		throw new UserInputError("Incorrect password.");
	}

	try {
		logger.debug(`Changing password for user: ${user.email}`);
		const updatedUser = await context.dataSources.authAPI.changePassword(user.email, newPassword);
		logger.debug(`Updated user: ${JSON.stringify(updatedUser)}`);
		return updatedUser;
	} catch (err: any) {
		logger.error(`Error changing password: ${err.message}`);
		throw new Error("Error changing password");
	}
};

module.exports = {changePassword};
