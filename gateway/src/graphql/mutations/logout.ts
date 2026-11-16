const logout = async (_: any, __: any, context: any) => {

	context.res.clearCookie('authToken', {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
	});

	return {message: "Logged out successfully"};
};

module.exports = {logout};