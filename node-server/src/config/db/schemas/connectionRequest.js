import mongoose from "mongoose";
// import validator from "validator";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import { ENV } from "../../../../utils/constants.js";


// scjhema defines the structure of a document with constraints, validations, etc
const connectionRequestSchema = new mongoose.Schema({
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum:{
        values: ["ignored","interested" ,"accepted", "rejected"],
        message: `{VALUE} is not a valid status. Status should be ignored, interested, accepted or rejected`
      }
    },
},{
  timestamps: true,

}); 

// userSchema.methods.validatePassword = async function (password) {
//     const isPasswordValid = await bcrypt.compare(password, this.password);
//     return isPasswordValid;
// }

// userSchema.methods.getJwt = async function () {
//     const token = jwt.sign({ _id: this._id }, ENV.JWT_SECRET_KEY,{
//       expiresIn: "1d"
//     });
//     return token;
// }

// model is a class with which we construct documents
const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
export const Status = connectionRequestSchema.path("status").enumValues;
export default ConnectionRequest;
