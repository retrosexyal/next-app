import { Schema, Types, model, models } from "mongoose";

export type AttendanceSource = "single" | "subscription" | "free";
export type RefundReason = "medical" | "free";

export interface IAttendance {
  lesson: Types.ObjectId;
  student: Types.ObjectId;

  present: boolean;

  source: AttendanceSource;

  // списано ли занятие
  consumed: boolean;

  // было ли возвращено занятие
  refunded?: boolean;
  refundReason?: RefundReason;

  // snapshot оплаты на урок
  payment?: {
    paymentId?: Types.ObjectId;
    type: AttendanceSource;
    amount: number;
    date: Date;
  };
}

const AttendanceSchema = new Schema(
  {
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    student: {
      type: Schema.Types.ObjectId,
      ref: "GroupStudent",
      required: true,
    },

    present: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      enum: ["single", "subscription", "free"],
      default: "free",
    },

    consumed: {
      type: Boolean,
      default: false,
    },

    refunded: {
      type: Boolean,
      default: false,
    },

    refundReason: {
      type: String,
      enum: ["medical", "free"],
    },

    payment: {
      paymentId: { type: Schema.Types.ObjectId },
      type: { type: String, enum: ["single", "subscription", "free"] },
      amount: Number,
      date: Date,
    },
  },
  { timestamps: true },
);

// защита от дублей
AttendanceSchema.index(
  { lesson: 1, student: 1 },
  { unique: true },
);

export default models?.Attendance ||
  model<IAttendance>("Attendance", AttendanceSchema);
