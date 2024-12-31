import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const PORT = process.env.PORT || 5000;
connectDb();

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Vite's default port
  "http://localhost:3000",
  "http://localhost:5000",
  "https://epic-cart-wheat.vercel.app/",
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
