import express from "express";
import ConnectionRequest, { Status } from "../../config/db/schemas/connectionRequest.js";
import User from "../../config/db/schemas/userModel.js";

const userRoute = express.Router();

const UserResponseData = "firstName lastName email age skills gender _id ";


// /user/connections
// /user/requests/recieved
// /user/requests/sent
// /user/feed

userRoute.get("/connections", async (req, res) => {
  try {
    const user = req.user;
    const connectionsData = await ConnectionRequest.find({
      $or: [
        { recieverId: user._id, status: "accepted" },
        { senderId: user._id, status: "accepted" }
      ]
    }).populate("senderId recieverId", "-password -createdAt -_v");

    const connections = connectionsData?.map((connection) => {
      if (connection.senderId._id.toString() === user._id.toString()) {
        return {...connection.recieverId.toObject(), requestId: connection._id};
      } else {
        return {...connection.senderId.toObject(), requestId: connection._id};
      }
    });

    res.send({
      data: connections
    });
  } catch (error) {
    res.status(500).json({ message: error?.message || "Something went wrong" });
  }
});


userRoute.get("/requests/recieved", async (req, res) => {
  try {
    const user = req.user;
    const requestsData = await ConnectionRequest.find({ recieverId: user._id, status: "interested" }).populate("senderId", { password: 0, createdAt: 0, _v: 0 });
    const requests = requestsData?.map((request) => {
      return {...request.senderId.toObject(), requestId: request._id};
    });
    res.send({
      data: requests
    });
  } catch (error) {
    res.status(500).json({ message: error?.message || "Something went wrong" });
  }
})

userRoute.get("/requests/sent", async (req, res) => {

  try {
    const user = req.user;
    const requestsData = await ConnectionRequest.find({ senderId: user._id, status: "interested" }).populate("recieverId", "-password -createdAt -_v");
    const requests = requestsData?.map((request) => {
      return {...request.recieverId.toObject(), requestId: request._id};
    });
    res.send({
      data: requests
    });
  } catch (error) {
    res.status(500).json({ message: error?.message || "Something went wrong" });
  }

})

userRoute.get("/feed", async (req, res) => {
  try {
    const user = req.user;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const skip= (page-1)*limit;
    const connections = await ConnectionRequest.find({
      $or: [
        { recieverId: user._id },
        { senderId: user._id }
      ]
    });

    const hideUsers = new Set();
    connections?.forEach((connection) => {
      hideUsers.add(connection.recieverId._id.toString());
      hideUsers.add(connection.senderId._id.toString());
    });

    // since loggedin user shoudnot be in the feed so add it in hideUsers
    hideUsers.add(user._id.toString());
    const feedData = await User.find({
      _id: { $nin: Array.from(hideUsers) }
    }).select("firstName lastName email age skills gender _id photoUrl about").skip(skip).limit(limit);

    res.send({
      data: feedData,
      page,
      limit,
      count: feedData.length
    });
  } catch (error) {
    res.status(500).json({ message: error?.message || "Something went wrong" });
  }
})

export default userRoute; 