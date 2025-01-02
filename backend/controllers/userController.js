import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

// CREATING AN USER

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();
  createToken(res, user._id);

  res.status(201).json({
    user,
    message: "Registration successful! Welcome to our platform!",
  });
});

// LOGIN USER

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  createToken(res, user._id);
  res.status(200).json({
    user,
    message: "Login successful! Welcome back!",
  });
});

// LOGOUT USER

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// GET ALL USERS

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(200).json(users);
});
// GET CURRENT USER

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    user,
    message: "Current user retrieved successfully",
  });
});

// UPDATE CURRENT USER

const updateCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { username, email, password } = req.body;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }
  }

  user.username = username || user.username;
  user.email = email || user.email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  await user.save();
  res.status(200).json({
    user,
    message: "Profile updated successfully",
  });
});

// DELETE USER BY ID

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isAdmin) {
    return res.status(400).json({ message: "Admin cannot be deleted" });
  }

  await user.deleteOne({ _id: user._id });
  res.status(200).json({ message: "User deleted successfully" });
});

// GET USER BY ID

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    user,
    message: "User retrieved successfully",
  });
});

// UPDATE USER BY ID

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { username, email } = req.body;

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }
  }

  user.username = username || user.username;
  user.email = email || user.email;

  await user.save();
  res.status(200).json({
    user,
    message: "User updated successfully",
  });
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
  deleteUserById,
  getUserById,
  updateUserById,
};
