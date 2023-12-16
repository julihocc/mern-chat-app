const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("./logger"); // Import the logger

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL, {
			useNewUrlParser: true, useUnifiedTopology: true,
		});
		logger.debug(`Connected to MongoDB: ${process.env.MONGODB_URL}`);
	} catch (err) {
		logger.error("Error connecting to MongoDB:", err);
		throw err;
	}
};

module.exports = connectDB;
