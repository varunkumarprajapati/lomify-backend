import mongoose, { Schema } from "mongoose";

export const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model("User", UserSchema);
