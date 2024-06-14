const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createNewUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, roles, location } = req.body;
    // validate.
    if (!roles) {
      return res.status(400).json({
        success: false,
        message: "Select a valid user account.",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill in the required field to create an account.",
      });
    }
    // check if password length is greater than 6.
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be greater than 6 characters.",
      });
    }

    // check if password matches regex format
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain one or more symbol, alphanumerical character, a lowercase, and an uppercase letter.",
      });
    }

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      // next("Email already registered. Please login");
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please login",
      });
    } //conflict
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPwd,
      roles,
      location,
    });
    const registeredUser = await User.findOne(newUser)
      .select("-password")
      .exec();
    console.log(registeredUser);
    return res.status(201).json({
      success: true,
      message: `${registeredUser.name} registered Successfully.`,
      registeredUser,
    });
  } catch (error) {
    // next(error);
    console.log(error);
    res.status(400).json({
      message: "Error in Creating New User",
      sucess: false,
      error: `${error.message}`,
    });
  }
};

module.exports = {
  createNewUser,
};
