const GoogleStrategy = require("passport-google-oauth20").Strategy;
const googleConfig = require("../config/googleConfig");
const User = require("../models/User");
const passport = require("passport");

passport.use(
  new GoogleStrategy(googleConfig, function (
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    User.findOrCreate({ name: profile.name }, function (err, user) {
      return done(err, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
