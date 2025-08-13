import express from "express";
import User from "../../config/db/schemas/userModel.js";
const authroute = express.Router();

authroute.get("/", (req, res) => {
    res.send("auth accessing");
});

authroute.post("/signup", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: "Request body is missing" });
    }

    const { name, email, password, age, gender } = req.body;


    const user = new User({ name, email, password, age, gender });
    await user.save();
    res.send("Signup success");
});

authroute.post("/login", (req, res) => {
    res.send("Login");
});

authroute.post("/logout", (req, res) => {
    res.send("Logout");
});

export default authroute;
