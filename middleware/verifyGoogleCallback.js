const User = require("../models/User");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const randomPassword = require("./randomPassword");

const verifyGoogleCallback = async (accessToken, refreshToken, profile, cb) => {
  try {
    const { id, name, email, phone } = profile;

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      // next("Email already registered. Please login");
      return cb.status(409).json({
        success: false,
        message: "Email already registered. Please login.",
      });
    } //conflict

    const password = randomPassword();
    const hashedPassword = await bcrypt.hash(password, 10); //Hash the password

    const user = await User.Create(
      { name, email } //, phone, password: hashedPassword, verified: true
    );

    // accessToken = jwt.sign(
    //   {
    //     UserInfo: {
    //       email,
    //     },
    //   },
    //   process.env.ACCESS_TOKEN_SIGNING_SECRET,
    //   { expiresIn: "30m" }
    // );
    // refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
    //   expiresIn: "1d",
    // });

    // user.refreshToken = refreshToken;
    // await user.save();
    // cb.cookie("jwt", refreshToken, {
    //   httpOnly: true,
    //   samesite: "None",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    // // secure: true;

    // cb.json({ accessToken });

    return null, user;
  } catch (err) {
    return err;
  }
};

module.exports = verifyGoogleCallback;
