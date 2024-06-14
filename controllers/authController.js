const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.sendStatus(401); //unauthorized

    // Evaluate password
    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      const roles = Object.values(foundUser.roles);
      // create JWT's
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );
      const refreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      //Saving refreshToken with current User
      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();
      const displayResult = await User.findOne(result)
        .select("-password")
        .exec();
      console.log(displayResult);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        samesite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });
      // secure: true

      res.json({ accessToken });
    } else {
      res.status(401).json({
        message:
          "Incorrect email or password. Please enter a valid credential.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error in Logging in User",
      sucess: false,
      error: `${error.message}`,
    });
  }
};
module.exports = {
  handleLogin,
};
