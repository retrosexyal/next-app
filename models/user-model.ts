import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isActivated: { type: Boolean, defaul: false },
  activationLink: { type: String },
  status: { type: String },
});

export default models.User || model("User", UserSchema);
