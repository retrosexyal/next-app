import { Schema, model, models } from "mongoose";

const SubscriptionSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "GroupStudent" },
  totalLessons: Number,
  usedLessons: { type: Number, default: 0 },
  expiresAt: Date
});

export default models?.Subscription || model("Subscription", SubscriptionSchema);
