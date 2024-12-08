import { Router } from "express";

import { captainlogin, captainregister, logoutcaptain } from "../controllers/captain.controller.js";
import { body } from "express-validator";
import { verifycaptainJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/createcaptian")
  .post(
    [
      body("email").isEmail().withMessage("Invalid Email"),
      body("fullname.firstname")
        .isLength({ min: 3 })
        .withMessage("First name must be at least 3 characters long"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
      body("vehicle.color")
        .isLength({ min: 3 })
        .withMessage("Color must be at least 3 characters long"),
      body("vehicle.plate")
        .isLength({ min: 3 })
        .withMessage("Model must be at least 3 characters long"),
      body("vehicle.capicity")
        .isLength({ min: 1 })
        .withMessage("Number must be at least 1 characters long"),
      body("vehicle.vehicleType")
        .isIn(["motorcycle", "car", "auto"])
        .withMessage("Number must be at least 3 characters long"),
    ],
    captainregister,
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
    
    captainlogin,
  );


  router
  .route("/logout").get(verifycaptainJWT, logoutcaptain);

export default router;
