import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { ENV } from "../../utils/constants.js";
import User from "../config/db/schemas/userModel.js";
const userAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decodedObj =  jwt.verify(token, ENV.JWT_SECRET_KEY);
    const userId = decodedObj._id;
    const user = await User.findById(userId, { password: 0, createdAt: 0, updatedAt: 0 });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export default userAuth;

