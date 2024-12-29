import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
} from "../controllers/userController.js";

import { authenicateUser , authorizeAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/").post(createUser).get(authenicateUser , authorizeAdmin , getAllUsers);
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

export default router;
