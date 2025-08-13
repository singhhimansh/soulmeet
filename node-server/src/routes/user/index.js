import express from "express";

const userRoute = express.Router();

userRoute.get("/", (req, res) => {
    res.send("user accessing");
});