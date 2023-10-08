import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  message: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User", unique: true },
});

export default models.Message || model("Message", MessageSchema);
