const logout = async (_, __, context) => {
	// Clear the authToken cookie
	context.res.clearCookie('authToken', {
		httpOnly: true,
		sameSite: 'lax'
	});

	return { message: "Logged out successfully" };
};

module.exports = { logout };