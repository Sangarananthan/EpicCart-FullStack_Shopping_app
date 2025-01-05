import express from "express";
import upload from "../config/cloudinary.js";

const router = express.Router();

router.route("/").post(upload.single("image"), async (req, res) => {
  try {
    if (req.file) {
      res.status(200).json({
        imageUrl: req.file.path,
        message: "Image uploaded successfully",
      });
    } else {
      res.status(400).json({
        message: "Image upload failed!",
        error: "No file provided",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error during upload",
      error: error.message,
    });
  }
});

export default router;
