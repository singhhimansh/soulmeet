import mongoose from "mongoose";
import validator from "validator";
// scjhema defines the structure of a document with constraints, validations, etc
const userSchema = new mongoose.Schema({
    name: {
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
    age :{
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [90, "Age must be at most 90"],
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

// model is a class with which we construct documents
const User = mongoose.model("User", userSchema);

export default User;
