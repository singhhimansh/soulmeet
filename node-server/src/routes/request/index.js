import mongoose from "mongoose";
import express from "express";
import ConnectionRequest from "../../config/db/schemas/connectionRequest.js";

// /request/send/:userId
// /request/accept/:requestId
// /request/reject/:requestId
// /request/ignored/:requestId

const requestRouter = express.Router();

requestRouter.post("/:status/:recieverId", async (req, res) => {
  try {


    const { status, recieverId } = req.params;
    const user = req.user;

    if (status !== "interested" && status !== "ignored") {
      return res.status(400).json({ message: "Invalid status" });
    }

    // check exisiting connections

    const existingConnection = await ConnectionRequest.findOne({
      $or: [
        { senderId: user._id, recieverId },
        { senderId: recieverId, recieverId: user._id }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({ message: "Connection already exists" });
    }

    const connectionRequest = await ConnectionRequest({
      senderId: user._id,
      recieverId,
      status
    })
    const data = await connectionRequest.save();
    res.status(200).json({ message: "Request sent to " + recieverId, data });
  } catch (error) {
    res.status(500).json({ message: error?.message || "Something went wrong" });
  }
});


requestRouter.patch("/:status/:requestId", async (req, res) => {
  try {


    const { status, requestId } = req.params;
    const user = req.user;

    if (status !== "accepted" && status !== "rejected") {
      return res.status(400).json({ message: "Invalid status" });
    }

    const connectionRequest = await ConnectionRequest.findOne({ $and: [{ _id: requestId }, { status: "interested" }] }).populate("senderId recieverId", { password: 0, createdAt: 0, _v: 0 });
    if (!connectionRequest) {
      return res.status(400).json({ message: "Request not found" });
    }


    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.status(200).json({ message: `${connectionRequest.recieverId.firstName} ${connectionRequest.recieverId.lastName}  ${status} ${connectionRequest.senderId.firstName} ${connectionRequest.senderId.lastName} request`, data });
  } catch (error) {
    res.status(500).json({ message: error?.message || "Something went wrong" });
  }
})


export default requestRouter;
