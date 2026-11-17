// authService/src/index.js
const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const rateLimit = require("express-rate-limit");
const connectDB = require("./utils/connectDB");
const errorHandler = require("./utils/errorHandler");
const logger = require("./utils/logger");
const ChatController = require("./controllers/ChatController");
const MessageController = require("./controllers/MessageController");
const SchoolController = require("./controllers/SchoolController");
const UserController = require("./controllers/UserController");
const requireInternalToken = require("./utils/requireInternalToken");

const PORT = process.env.PORT || 4500;

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

app.use(express.json({limit: "8mb"}));
app.use(requireInternalToken);

// RESTful routes
app.get("/v1/chat-room-populated", ChatController.getChatRoomByIdPopulatedWithUsers);
app.get("/v1/search", ChatController.getChatRooms)

app.get("/v1/chat-room", ChatController.getChatRoom);
app.post("/v1/chat-room", ChatController.createChatRoom);

app.get("/v1/messages", MessageController.getMessagesByChatRoomId);
app.post("/v1/message", MessageController.saveMessage);

app.post("/v1/user", UserController.createUser);
app.delete("/v1/user", UserController.deleteUser);
app.put("/v1/user", UserController.updateUser);

app.post("/v1/school-room", SchoolController.startSchoolRoom);
app.post("/v1/school-room/claim", SchoolController.claimSchoolRoom);
app.get("/v1/school-rooms", SchoolController.listWaitingRooms);
app.get("/v1/message", SchoolController.getMessage);
app.post("/v1/knowledge/document", SchoolController.saveDocument);
app.get("/v1/knowledge/search", SchoolController.searchKnowledge);
app.post("/v1/marked-answer", SchoolController.saveMarkedAnswer);

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

