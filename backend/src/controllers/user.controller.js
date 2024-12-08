import { asyncHandler } from "../utils/asyncHandler.js";
import { usercreate } from "../servies/user.serive.js";
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import BlacklistToken from "../models/blacklisttoken.model.js";

export const registeruser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;
  const { firstname, lastname } = fullname;

  const user = await usercreate({ firstname, lastname, email, password });

  const token = user.genraterefreshToken();

  res.status(200).json({
    success: true,
    message: "User created successfully",
    data: user,
    token,
  });
});

export const loginuser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;



  const user = await User.findOne({ email }).select('+password');
  


  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const isMatch = await user.ispasswordcorrect(password);
  console.log(isMatch);
  if (!isMatch) {
    throw new ApiError(401, "Invalid password");
  }

  const token = user.genraterefreshToken();

  res.cookie('token', token);

  res.status(200).json({ token, user });
});


export const logoutuser = asyncHandler(async (req, res) => {


  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")

  const blacklistToken = await BlacklistToken.create({ token: token });
  res.clearCookie('token');

  res.status(200).json({ message: "User logged out successfully" });
});


export const getuserdata = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({ user });

  
});

