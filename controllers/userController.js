const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getAllUser = async (req, res) => {
  const users = await User.find().select("-password");
  if (!users) return res.status(204).json({ message: "No Users found." });
  res.json(users);
};

const updateUser = async (req, res) => {
  try {
    const { id, name, password, email, phone, location } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (name) {
      return res
        .status(403)
        .json({ message: "You can not change your username." });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: `No user ID matches ${id}` });
    }

    const user = await User.findOne({ _id: id }).exec();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (req?.body?.email) user.email = email;
    if (req?.body?.password) user.password = hashedPassword;
    if (req?.body?.phone) user.phone = phone;
    if (req?.body?.location) user.location = location;

    const result = await user.save();
    const updatedUser = await User.findOne(result).select("-password").exec();
    console.log(updatedUser);
    return res.status(201).json({
      success: true,
      message: `${updatedUser.name} updated Successfully.`,
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error in Updating User details",
      sucess: false,
      error: `${error.message}`,
    });
  }
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "User ID required." });
  }
  if (!mongoose.isValidObjectId(req.body.id))
    return res
      .status(400)
      .json({ message: `No user ID matches ${req.body.id}.` });

  const user = await User.findOne({ _id: req.body.id }).exec();
  const result = await user.deleteOne({ _id: req.body.id });

  res.json(result);
};

const filterUsers = async (req, res) => {};

const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID is required." });

  if (!mongoose.isValidObjectId(req.params.id))
    return res
      .status(400)
      .json({ message: `No user ID matches ${req.params.id}` });

  const user = await User.findOne({ _id: req.params.id })
    .select("-password")
    .exec();

  res.json(user);
};

module.exports = {
  getAllUser,
  updateUser,
  deleteUser,
  filterUsers,
  getUser,
};
