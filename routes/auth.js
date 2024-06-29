const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["email", "profile"] }));

router
  .route("/google/callback")
  .get(
    passport.authenticate("google", { failureRedirect: "/register" }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect("/");
    }
  );
router.post("/", authController.handleLogin);

module.exports = router;
