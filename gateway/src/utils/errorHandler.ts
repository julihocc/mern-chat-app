
const logger = require("./logger");

const errorHandler = (err: any, req: any, res: any, next: any) => {
  logger.error(err.stack);
  if (res.headersSent) {
    return;
  }
  res.status(500).send("Something went wrong");
};

module.exports = errorHandler;
