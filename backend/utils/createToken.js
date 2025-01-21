import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  if (!userId) {
    throw new Error("UserId is required");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  // Modified cookie settings
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // Always true since you're using HTTPS in both environments
    sameSite: "none", // Required for cross-origin requests
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
    // Remove domain setting as it might be causing issues
  });

  return token;
};

export default generateToken;
