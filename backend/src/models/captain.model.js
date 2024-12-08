import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const captainSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        required: true,
      },
      lastname: {
        type: String,
        minlength: [3, "Last name must be at least 3 characters long"],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    socketId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    vehicle: {
      color: {
        type: String,
        required: true,
        minlength: [3, "color must be at least 3 characters long"],
      },
      plate: {
        type: String,
        required: true,
        minlength: [3, "plate must be at least 3 characters long"],
      },
      capicity: {
        type: Number,
        required: true,
        min: [1, "capicity must be at least 1 characters long"],
      },
      vehicleType: {
        type: String,
        required: true,
        enum: ["motorcycle", "car", "auto"],
      },
    },
    location: {
      lat: {
        type: Number,
      },
      long: {
        type: Number,
      },
    },
  },
  { timestamps: true },
);

// captainSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

captainSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("Password after hashing during save:", this.password); // log hashed password
  next();
});


captainSchema.methods.ispasswordcorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.methods.generateCaptainToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

export const Captain = mongoose.model("Captain", captainSchema);
