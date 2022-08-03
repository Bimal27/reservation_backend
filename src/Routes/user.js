import express from "express"
import User from "../Models/UserSchema.js"
import bcrypt from "bcryptjs"
import createError from "http-errors"
import jwt from 'jsonwebtoken'
import { JwtMiddleware } from "../utils/jwt.js"

const userRouter = express.Router()

// ************************ Register a User *************************

userRouter.post('/register', async(req, res, next) =>{
    try {
        
        const { name, email,country,city, phone, password } = req.body
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        const user = await User.create({name, email, country, city, phone,password:hash})

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
        
        res.status(200).json({
            success: true,
            user,
            token
        })
    } catch (error) {
        next(error)
    }
})

// ************************ Login *************************

userRouter.post('/login', async(req, res, next) =>{
    try {
       const user = await User.findOne({email: req.body.email}).select("+password")
       if(!user) return next(createError(401,"Invalid email or password"));

       const isPasswordCorrect = await bcrypt.compare(req.body.password , user.password)
       if(!isPasswordCorrect) return next(createError(401,"Invalid email or password"));

       const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
       
       const { password, isAdmin, ...otherDetails } = user._doc;
       res.status(200).json({ 
           details: { ...otherDetails }, isAdmin,
           token })
            
    } catch (error) {
        next(error)
    }
})

// ************************ Update User *************************

userRouter.put("/user/:id", JwtMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
})


// ************************ Delete User *************************

userRouter.delete("/user/:id", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
});

// ************************ Get single User *************************
userRouter.put("/user/:id", async (req, res, next) => {
 try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// ************************ Get all User *************************
userRouter.put("/users", async (req, res, next) => {
   try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

export default userRouter