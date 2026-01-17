import { Schema, model, models } from "mongoose";

const ContractSchema = new Schema({
  parentName: { type: String, required: true },
  childrenName: { type: String, required: true },
  birthday: { type: String, required: true },
  diseases: { type: String, required: true, default: "не указаны" },
  place: { type: String, required: true },
  KB: { type: String, required: true },
  address: { type: String, required: true },
  sex: { type: String, required: true, default: "мою дочь" },
  pasportDate: { type: String, required: true },
  pasportPlace: { type: String, required: true },
  phone: { type: String, required: true },
  isDone: { type: Boolean, required: true, default: false },
  isSend: { type: Boolean, required: true, default: false },
  isOldContract: { type: Boolean, required: false, default: false },
  date: { type: String },
  number: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default models?.Contract || model("Contract", ContractSchema);
