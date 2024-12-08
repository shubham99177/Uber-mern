import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { captaincreate } from "../servies/captain.service.js";
import { Captain } from "../models/captain.model.js";
import BlacklistToken from "../models/blacklisttoken.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";


export const captainregister = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { fullname, email, password, vehicle } = req.body;
    const { firstname, lastname } = fullname;
    const { color, plate, capicity, vehicleType } = vehicle;
  
    const alreadyExists = await Captain.findOne({ email });
    if (alreadyExists) {
      return res.status(400).json({ message: "Captain already exists" });
    }
  
    console.log(
      `In controller: ${firstname}, ${lastname}, ${email}, ${password}, ${color}, ${plate}, ${capicity}, ${vehicleType}`
    );
  
    const captain = await captaincreate(
      firstname,
      lastname,
      email,
      password,
      color,
      plate,
      capicity,
      vehicleType
    );
  
    console.log("Created captain:", captain);
  
    // Ensure the document is valid and has instance methods
    if (!(captain instanceof mongoose.Document)) {
      throw new Error("Captain creation failed");
    }
  
    const token = captain.generateCaptainToken();
  
    res.status(200).json({
      success: true,
      message: "Captain created successfully",
      data: captain,
      token,
    });
  });
  



  export const captainlogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const captain = await Captain.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(401).json({ message: "Invalid email" });
    }
  
    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", captain.password);
  
    const isMatch = await captain.ispasswordcorrect(password);
    console.log("Password Match Result:", isMatch);
  
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
  
    const token = captain.generateCaptainToken();
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.status(200).json({ success: true, message: "Login successful", token });
  });
  


export const logoutcaptain = asyncHandler(async (req, res) => {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")

  const blacklistToken = await BlacklistToken.create({ token: token });
  res.clearCookie('token');

  res.status(200).json({ message: "captain logged out successfully" });
    
})