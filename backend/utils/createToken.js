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

  // Adjust cookie settings based on environment
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction, // true in production
    sameSite: isProduction ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
    domain: isProduction ? ".onrender.com" : undefined, // Adjust this based on your domain
  });

  return token;
};

export default generateToken;
