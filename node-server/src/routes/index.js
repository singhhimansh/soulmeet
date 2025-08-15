import express from "express";
import auth from "./auth/index.js";
import userRoute from "./user/index.js";
import userAuth from "../middlewares/auth.js";
import profileRoute from "./profile/index.js";

const router = express.Router();


router.use("/auth", auth);
router.use("/profile", userAuth ,profileRoute);
router.use("/user", userAuth ,userRoute);

export default router;
