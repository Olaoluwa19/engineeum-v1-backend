const randomPassword = require("../middleware/randomPassword");

const sessionConfig = () => {
  return {
    secret: process.env.ACCESS_TOKEN_SIGNING_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  };
};

module.exports = sessionConfig;
