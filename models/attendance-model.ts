import { Schema, Types, model, models } from "mongoose";

export type AttendanceSource = "single" | "subscription" | "free";

export interface IAttendance {
  lesson: Types.ObjectId;
  student: Types.ObjectId;
  present: boolean;
  source: AttendanceSource;
  consumed: boolean;
}

const AttendanceSchema = new Schema(
  {
    lesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
    consumed: { type: Boolean, default: false },
    student: { type: Schema.Types.ObjectId, ref: "GroupStudent" },
    present: Boolean,
    source: {
      type: String,
      enum: ["single", "subscription", "free"],
      default: "free",
    },
  },
  { timestamps: true },
);

AttendanceSchema.index({ lesson: 1, student: 1 }, { unique: true });

export default models?.Attendance || model("Attendance", AttendanceSchema);
