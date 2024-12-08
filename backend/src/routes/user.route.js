import { body } from "express-validator";
import {
  getuserdata,
  loginuser,
  logoutuser,
  registeruser,
} from "../controllers/user.controller.js";
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/register")
  .post(
    [
      body("email").isEmail().withMessage("Invalid Email"),
      body("fullname.firstname")
        .isLength({ min: 3 })
        .withMessage("First name must be at least 3 characters long"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ],
    registeruser,
  );

router
  .route("/login")
  .post(
    [
      body("email").isEmail().withMessage("Invalid Email"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ],
    loginuser,
  );

router.route("/logout").get(verifyJWT, logoutuser);

router.route("/getuser").get(verifyJWT, getuserdata);

export default router;
