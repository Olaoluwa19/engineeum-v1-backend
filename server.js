// Package imports
require("dotenv").config();
const express = require("express");
require("express-async-errors");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const passport = require("passport");
require("./middleware/googleStrategy");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");

// API Documentation
const swaggerDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./config/swaggerOptions");

const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const session = require("express-session");
const sessionConfig = require("./config/sessionConfig");
const connectDB = require("./config/dbConn");
const { connect } = require("http2");
const PORT = process.env.PORT || 3000;
const colors = require("colors");

// connect to MongoDB
connectDB();

//Swagger api Config
const spec = swaggerDoc(swaggerOptions);

// custom middleware logger
app.use(logger);

// handle options credential check before cors
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data i.e form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

//handle google login
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// swagger homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

app.use(verifyJWT);
app.use("/users", require("./routes/api/users"));
app.use("/jobs", require("./routes/api/jobs"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found." });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`.bgCyan.white)
  );
});
