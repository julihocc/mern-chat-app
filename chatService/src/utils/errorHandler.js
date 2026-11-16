// path: contactService\src\errorHandler.js
const logger = require("./logger"); // Import the logger

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  if (res.headersSent) {
    return;
  }
  res.status(500).send("Something went wrong");
};

module.exports = errorHandler;
