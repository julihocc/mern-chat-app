const logout = async (_, __, context) => {

	context.res.clearCookie('authToken', {
		httpOnly: true, sameSite: 'lax'
	});

	return {message: "Logged out successfully"};
};

module.exports = {logout};