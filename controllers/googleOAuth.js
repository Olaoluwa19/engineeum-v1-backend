const passport = require("passport");

const authenticateGoogle = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile"] })(req, res, next);
};

const authenticateGoogleCallback = (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/auth" })(req, res, next);
};

const redirectHome = (req, res) => {
  res.redirect("/");
};

module.exports = {
  authenticateGoogle,
  authenticateGoogleCallback,
  redirectHome,
};
