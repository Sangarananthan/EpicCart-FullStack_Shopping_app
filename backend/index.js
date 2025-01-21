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
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || "development";
connectDb();

const app = express();

// Place these BEFORE routes
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "https://epic-cart-wheat.vercel.app",
  "https://epic-cart.onrender.com",
  "https://epic-cart-pp6nbhnca-sangarananthans-projects.vercel.app",
  // Add this to handle Vercel preview deployments
  /^https:\/\/epic-cart.*\.vercel\.app$/,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      // Check exact matches first
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Check regex patterns for Vercel preview URLs
      const isVercelPreview = allowedOrigins.some((allowedOrigin) => {
        return allowedOrigin instanceof RegExp && allowedOrigin.test(origin);
      });

      if (isVercelPreview) {
        return callback(null, true);
      }

      const msg = "Origin not allowed by CORS";
      return callback(new Error(msg), false);
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


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
app.use("/api/orders/", orderRoutes);

// PAYPAL API
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

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
