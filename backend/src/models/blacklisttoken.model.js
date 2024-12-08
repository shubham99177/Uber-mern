import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true, // Ensures efficient querying
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now, // Automatically sets the timestamp when the token is added
  },
});

// Add a TTL index on the `createdAt` field with an expiration time of 86400 seconds (24 hours)
blacklistTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const BlacklistToken = mongoose.model("BlacklistToken", blacklistTokenSchema);

export default BlacklistToken;
