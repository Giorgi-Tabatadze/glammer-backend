const { logEvents } = require("./logger");

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log",
  );
  console.log(err.stack);

  let status;
  switch (err.name) {
    case "SequelizeValidationError":
      status = 400;
      break;
    case "SequelizeUniqueConstraintError":
      status = 409;
      break;
    default:
      status = res.statusCode ? res.statusCode : 500; // server error
      break;
  }
  res.status(status);

  res.json({ message: err.message, isError: true });
};

module.exports = errorHandler;
