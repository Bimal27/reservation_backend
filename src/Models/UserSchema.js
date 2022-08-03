import mongoose from "mongoose";
import validator from "validator"
const { Schema, model} = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your name"],
    maxLength: [20, "Name cannot exceed 20 characters"],
    minLength: [4, "Name must be more than 4 characters"]
  },
  email: {
    type: String,
    required: [true, "Please enter you email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"]
  },
    country: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password must be greater than 8 characters"],
    select: false
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})
export default model("User", userSchema)
