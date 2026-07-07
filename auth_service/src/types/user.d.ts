import type { InferSchemaType } from "mongoose";
import type { UserSchema } from "../models/user.model.js";

declare global {
  type IUser = InferSchemaType<typeof UserSchema>;

  interface UserCreateDTO extends Omit<IUser, "_id" | "username" | "isVerified" | "createdAt" | "updatedAt"> {}
}

export {};
