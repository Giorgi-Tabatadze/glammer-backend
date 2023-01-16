require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/dbConn");
const corsOption = require("./config/corsOptions");

const PORT = process.env.PORT || 3500;

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

connectDB();

app.use(logger("dev"));
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const indexRouter = require("./routes/root");

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500; // server error
  res.status(status);

  res.json({ message: err.message, isError: true });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});

module.exports = app;
