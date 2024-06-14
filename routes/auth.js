const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const googleOAuth = require("../controllers/googleOAuth");

router.post("/", authController.handleLogin);
router.route("/google").get(googleOAuth.authenticateGoogle);

router
  .route("/google/callback")
  .get(
    passport.authenticate("google", { failureRedirect: "/auth" }),
    googleOAuth.redirectHome
  );

module.exports = router;
