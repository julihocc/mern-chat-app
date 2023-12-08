// authService/src/index.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const rateLimit = require("express-rate-limit");
const connectDB = require("./utils/connectDB");
const errorHandler = require("./utils/errorHandler");
const logger = require("./utils/logger");
const ChatController = require("./controllers/ChatController");
const MessageController = require("./controllers/MessageController");
const UserController = require("./controllers/UserController");

const PORT = process.env.PORT || 4500;

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
// app.use(cors(corsOptions));

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

// RESTful routes
// app.get("/v1/chat-room-by-id", ChatController.getChatRoomById);
// app.get("/v1/chat-room-by-participant-ids", ChatController.getChatRoomByParticipantIds);
app.get("/v1/chat-room-populated", ChatController.getChatRoomByIdPopulatedWithUsers);
app.get("/v1/search", ChatController.getChatRooms)

app.get("/v1/chat-room", ChatController.getChatRoom);
app.post("/v1/chat-room", ChatController.createChatRoom);

app.get("/v1/messages", MessageController.getMessagesByChatRoomId);
app.post("/v1/message", MessageController.saveMessage);

app.post("/v1/user", UserController.createUser);
app.put("/v1/user", UserController.updateUser);

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

