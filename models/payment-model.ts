import { Schema, model, models } from "mongoose";

const PaymentSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "GroupStudent" },
  type: { type: String, enum: ["single", "subscription"] },
  lessonsCount: Number,
  amount: Number,
  date: Date,
  externalId: { type: String, unique: true, index: true },
});

export default models?.Payment || model("Payment", PaymentSchema);
