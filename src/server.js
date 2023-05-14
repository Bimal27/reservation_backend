import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors'
import userRouter from "./Routes/user.js";
import roomRouter from "./Routes/room.js";
import hotelRouter from "./Routes/hotel.js";
dotenv.config();

const port = process.env.PORT;

const server = express();

server.use(express.json());

server.use(
  cors({
    origin: "https://reservation-web-page.vercel.app",
    credentials: true
  })
);

// *******************Routes*************************

 server.use("/", userRouter);
 server.use("/rooms", roomRouter);
 server.use("/hotels", hotelRouter);
//  router.put("/:id", verifyUser, updateUser);

// *******************MongoConnection*************************
mongoose.connect(process.env.MONGO_CONNECTION_URL);

mongoose.connection.on("connected", ()=>{
    console.log("Successfully connected to mongo!!")
     server.listen(port, () => {
       console.log(`Server running on port ${port}`);
     });
})

 mongoose.connection.on("error",() =>{
     console.log("error")
 })
       

