import express from "express";

const userRoute = express.Router();

userRoute.get("/", (req, res) => {
  res.send({
    user: req.user
  });
});

userRoute.get("/profile", (req, res) => {
  res.send({
    user: req.user
  });
});

export default userRoute; 