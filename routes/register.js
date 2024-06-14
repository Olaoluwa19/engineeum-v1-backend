const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const googleOAuth = require("../controllers/googleOAuth");

router.post("/", registerController.createNewUser);

module.exports = router;
