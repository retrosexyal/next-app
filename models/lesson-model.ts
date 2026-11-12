import { Schema, Types, model, models } from "mongoose";

export interface ILesson {
  group: Types.ObjectId;
  date: Date;
}

const LessonSchema = new Schema(
  {
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    date: { type: Date, required: true },
    attendanceRevision: { type: Number, default: 0 },
  },
  { timestamps: true },
);

LessonSchema.index({ group: 1, date: 1 }, { unique: true });

export default models?.Lesson || model("Lesson", LessonSchema);
