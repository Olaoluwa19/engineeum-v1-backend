const GoogleStrategy = require("passport-google-oauth20").Strategy;
const verifyGoogleCallback = require("./verifyGoogleCallback");
const googleConfig = require("../config/googleConfig");
const passport = require("passport");

const googleStrategy = new GoogleStrategy(googleConfig, verifyGoogleCallback);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

module.exports = googleStrategy;
