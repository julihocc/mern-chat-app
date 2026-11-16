// authService/src/index.js
const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const rateLimit = require("express-rate-limit");

const connectDB = require("./utils/connectDB");
const errorHandler = require("./utils/errorHandler");
const logger = require("./utils/logger");
const UserController = require('./controllers/UserController');
const PasswordController = require('./controllers/PasswordController');
const requireInternalToken = require('./utils/requireInternalToken');

const PORT = process.env.PORT || 5000;

const app = express();

// Static files
app.use(express.static(__dirname + "/public"));

// Rate limiting
const apiLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour window
	max: 10000, // limit each IP to 10000 requests per windowMs
	message: "Too many requests from this IP, please try again after an hour",
});
app.use(apiLimiter);

// Cookie parsing
app.use(cookieParser());

app.use(express.json());
app.use(requireInternalToken);

app.get('/v1/user', UserController.getUser);
app.post('/v1/user', UserController.createUser);
app.delete('/v1/user', UserController.deleteUser);
app.put('/v1/user', UserController.updateUser);
app.get('/v1/contacts', UserController.getContactsByUserId);
app.get('/v1/token', UserController.getTokenByPayload);
app.post('/v1/password/compare', PasswordController.comparePasswords);
app.put('/v1/password', PasswordController.changePassword);
app.get('/v1/search', UserController.getManyUsersByEmail);

app.use(errorHandler);

async function startServer() {
	try {
		await connectDB();
		const httpServer = http.createServer(app);
		httpServer.listen(PORT, () => {
			logger.debug(`Server is running at http://localhost:${PORT}`);
		});
	} catch (err: any) {
		logger.error("Error starting the authentication service:", err);
	}
}

(async () => {
	try {
		await startServer();
	} catch (err: any) {
		logger.error("Error starting the authentication service:", err);
	}
})();

