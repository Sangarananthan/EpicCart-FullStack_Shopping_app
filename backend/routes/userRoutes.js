import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";

import {
  authenicateUser,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenicateUser, authorizeAdmin, getAllUsers);
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);
router
  .route("/profile")
  .get(authenicateUser, getCurrentUser)
  .put(authenicateUser, updateCurrentUser);
router
  .route("/:id")
  .delete(authenicateUser, authorizeAdmin, deleteUserById)
  .get(authenicateUser, authorizeAdmin, getUserById)
  .put(authenicateUser, authorizeAdmin, updateUserById);
export default router;
