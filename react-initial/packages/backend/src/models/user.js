import { Schema, model } from "mongoose";

export const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: String,
});

const User = model("User", userSchema);

export default User;
