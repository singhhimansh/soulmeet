import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ENV } from "../../../../utils/constants.js";


// scjhema defines the structure of a document with constraints, validations, etc
const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 100,
      validate: (value)=>{
        if(!validator.isEmail(value)){
          throw new Error("Invalid email");
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    age :{
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [90, "Age must be at most 90"],
    },
    skills:{
      type: [String],
    },
    gender:{
      type: String,
      enum: ["male", "female", "other"],
      validate: {
        validator: function(v) {
          return v === "male" || v === "female" || v === "other";
        },
        message: "Not a valid gender. Gender should be male, female or other"
      } 
    },
},{
  timestamps: true,

}); 

userSchema.methods.validatePassword = async function (password) {
    const isPasswordValid = await bcrypt.compare(password, this.password);
    return isPasswordValid;
}

userSchema.methods.getJwt = async function () {
    const token = jwt.sign({ _id: this._id }, ENV.JWT_SECRET_KEY,{
      expiresIn: "1d"
    });
    return token;
}

// model is a class with which we construct documents
const User = mongoose.model("User", userSchema);

export default User;
