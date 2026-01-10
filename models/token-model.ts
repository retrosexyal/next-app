import { Schema, model, models } from "mongoose";

const TokenSchema = new Schema({
  refreshToken: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default models?.Token || model("Token", TokenSchema);
