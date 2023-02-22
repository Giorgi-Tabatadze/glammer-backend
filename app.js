require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const corsOption = require("./config/corsOptions");
const { logEvents, logger } = require("./middleware/logger");
const db = require("./models");
const InsertMockData = require("./mock/insertMock");

const PORT = process.env.PORT || 3500;

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      "mongoErrLog.log",
    );
  }
  await db.sequelize.sync({ force: true });
  if (process.env.NODE_ENV === "development") {
    await InsertMockData();
  }
})();

app.use(logger);
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const indexRouter = require("./routes/root");
const usersRouter = require("./routes/userRoutes");
const productsRouter = require("./routes/productRoutes");
const trackingsRouter = require("./routes/trackingRoutes");
const productInstanceRouter = require("./routes/productInstanceRoutes");
const orderRouter = require("./routes/orderRoutes");
const scaccountRouter = require("./routes/scaccountRoutes");
const deliveryRouter = require("./routes/deliveryRoutes");
const authRouter = require("./routes/authRoutes");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/trackings", trackingsRouter);
app.use("/productinstances", productInstanceRouter);
app.use("/orders", orderRouter);
app.use("/scaccounts", scaccountRouter);
app.use("/deliveries", deliveryRouter);
app.use("/auth", authRouter);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

module.exports = app;
