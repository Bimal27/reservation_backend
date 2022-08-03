import express from "express";
import Room from "../Models/RoomSchema.js";
import Hotel from "../Models/HotelSchema.js";
import { verifyAdmin } from "../utils/jwt.js";

const roomRouter = express.Router();

// ************************ Create room *************************

roomRouter.post('/:hotelid',verifyAdmin, async(req, res, next) =>{
    const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id }
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
    
})

// ************************ Update room *************************

roomRouter.put("/:hotelid",verifyAdmin, async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
});

// ************************ Update room availability *************************

roomRouter.put("/:hotelid", async (req, res, next) => {
    try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates
        }
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
  
});

//************************ Delete room  *************************

roomRouter.delete("/:hotelid",verifyAdmin, async (req, res, next) => {
 const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id }
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
  
});

//*********************** Get room  *************************

roomRouter.get("/:hotelid", async (req, res, next) => {
 try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
  
});

//*********************** Get all rooms  *************************

roomRouter.get("/", async (req, res, next) => {
 try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
  
});

export default roomRouter

