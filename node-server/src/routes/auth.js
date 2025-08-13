import express from "express";

const authroute = express.Router();

authroute.post("/signup", (req, res) => {
    res.send("Signup");
})

authroute.post("/login", (req, res) => {
    res.send("Login");
})

authroute.post("/logout", (req, res) => {
    res.send("Logout");
})

export default authroute;
