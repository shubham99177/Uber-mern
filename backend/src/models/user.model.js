import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  fullname: {
      firstname: {
          type: String,
          required: true,
          minlength: [ 3, 'First name must be at least 3 characters long' ],
      },
      lastname: {
          type: String,
          minlength: [ 3, 'Last name must be at least 3 characters long' ],
      }
  },
  email: {
      type: String,
      required: true,
      unique: true,
      minlength: [ 5, 'Email must be at least 5 characters long' ],
  },
  password: {
      type: String,
      required: true,
      select: false,
  },
  socketId: {
      type: String,
  },
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

userSchema.methods.ispasswordcorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};


userSchema.methods.genraterefreshToken = function () {
  return jwt.sign({ userId: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const User = model("User", userSchema);
