const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: true,
    },
    roles: {
      type: [
        {
          type: Number,
          enum: [2001, 6403, 5929],
        },
      ],
      default: [2001],
    },
    phone: {
      type: Number,
      required: false,
    },
    location: {
      type: String,
      default: "Lagos",
    },
    refreshToken: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
