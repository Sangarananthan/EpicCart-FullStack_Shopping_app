import express from "express";
import {
  authenicateUser,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";
const router = express.Router();

router.route("/").post(authenicateUser, authorizeAdmin, createCategory);
router.route("/:categoryId").put(authenicateUser, authorizeAdmin, updateCategory);
router
  .route("/:categoryId")
  .delete(authenicateUser, authorizeAdmin, removeCategory);

router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);

export default router;
