import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || "development";
connectDb();

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Vite's default port
  "http://localhost:3000",
  "http://localhost:5000",
  "https://epic-cart-wheat.vercel.app/",
  "https://epic-cart.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

//  USER API
app.use("/api/users/", userRoutes);

//  CATEGORY API
app.use("/api/categories/", categoryRoutes);

//  PRODUCT API
app.use("/api/products/", productRoutes);

//UPLOAD API
app.use("/api/uploads/", uploadRoutes);

//  ORDER API
// app.use("/api/orders/", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(
    `API available at: ${
      NODE_ENV === "production"
        ? "https://epic-cart.onrender.com"
        : `http://localhost:${PORT}`
    }`
  );
});
