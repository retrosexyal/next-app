import { Schema, model, models } from "mongoose";

const SubscriptionSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "GroupStudent" },
  totalLessons: Number,
  usedLessons: { type: Number, default: 0 },
  expiresAt: Date,
  // Включается явно только при создании новых абонементов, без миграции старых.
  autoMissCompensation: Boolean,
  lastChargedLesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
  compensatedMissedLesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
  compensationLesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
});

export default models?.Subscription ||
  model("Subscription", SubscriptionSchema);
