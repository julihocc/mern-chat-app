// authService/src/index.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const rateLimit = require("express-rate-limit");

const connectDB = require("./utils/connectDB");
const errorHandler = require("./utils/errorHandler");
const logger = require("./utils/logger");
const UserController = require('./controllers/UserController');

const PORT = process.env.PORT || 5000;

const app = express();

// Static files
app.use(express.static(__dirname + "/public"));

// CORS setup
const corsOptions = {
	origin: "*",
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Rate limiting
const apiLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour window
	max: 10000, // limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again after an hour",
});
app.use(apiLimiter);

// Error handling
app.use(errorHandler);

// Cookie parsing
app.use(cookieParser());

app.use(express.json());

// RESTful route for getting user by email
app.get('/auth-service/getUserByEmail/:email', UserController.getUserByEmail);
app.post('/auth-service/getPasswordComparison', UserController.getPasswordComparison);

async function startServer() {
	try {
		await connectDB();
		const httpServer = http.createServer(app);
		httpServer.listen(PORT, () => {
			logger.debug(`Server is running at http://localhost:${PORT}`);
		});
	} catch (err) {
		logger.error("Error starting the authentication service:", err);
	}
}

(async () => {
	try {
		await startServer();
	} catch (err) {
		logger.error("Error starting the authentication service:", err);
	}
})();

