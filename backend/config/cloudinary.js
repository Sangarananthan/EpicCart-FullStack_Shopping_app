import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dmy7zm3ip",
  api_key: process.env.CLOUDINARY_API_KEY || "789915734912848",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "oxFDN4ntLtg-w6rS2bhXTXwgtGo",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "avif"],
  },
});

const upload = multer({ storage: storage });

export default upload;
