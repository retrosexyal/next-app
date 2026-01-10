import { Schema, model, models } from "mongoose";

const ShablonSchema = new Schema({
  name: { type: String, require: true, default: "Dogovor" },
  number: { type: Number, required: true, default: 1 },
});

export default models?.Shablon || model("Shablon", ShablonSchema);
