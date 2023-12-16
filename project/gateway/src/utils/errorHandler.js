
const logger = require("./logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something went wrong");
  next();
};

module.exports = errorHandler;
