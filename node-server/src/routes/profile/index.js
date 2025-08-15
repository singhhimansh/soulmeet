import express from "express";
import User from "../../config/db/schemas/userModel.js";
import bcrypt from "bcrypt";
const profileRoute = express.Router();

profileRoute.get("/", (req, res) => {
  res.send({
    data: req.user
  });
});

profileRoute.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId, { password: 0, createdAt: 0, updatedAt: 0, _v: 0 });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  res.send({ data: user });
});
profileRoute.patch("/", async (req, res) => {



  const { firstName, lastName, age, gender, skills, about, email, photoUrl, password } = req.body;
  if (email || password) {
    return res.status(400).json({ message: "Email and password cannot be updated!" });
  }
  // const user = await User.findById(userId,{password:0,createdAt:0,updatedAt:0,_v:0});
  const userUpdated = await User.findByIdAndUpdate(req.user._id, { firstName, lastName, age, gender, skills, about, photoUrl }, { new: true, runValidators: true, select: "firstName lastName email age skills gender photoUrl" });
  if (!userUpdated) {
    return res.status(400).json({ message: "User not found" });
  }
  res.send({ data: userUpdated, message: "User updated successfully" });
});

profileRoute.patch("/resetPassword", async (req, res) => {
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  res.send("Password reset successfully");
});

profileRoute.delete("/delete", async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  res.clearCookie("token");
  res.send("User deleted successfully");
});



export default profileRoute; 