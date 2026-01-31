import { Schema, Types, model, models } from "mongoose";

export interface IStudent {
  fullName: string;
  phone?: string;
  contract?: Types.ObjectId | null;
  isTemp: boolean;
  activeSubscription?: Types.ObjectId | null;
  lastPayment?: {
    amount: number;
    date: Date;
    type: "single" | "subscription";
    externalId: string;
  };
  paymentsSyncedAt?: Date;
}

const GroupStudentSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String },

    // может быть null
    contract: { type: Schema.Types.ObjectId, ref: "Contract", default: null },

    // временный ученик
    isTemp: { type: Boolean, default: true },
    lastPayment: {
      amount: Number,
      date: Date,
      type: { type: String, enum: ["single", "subscription"] },
      externalId: String,
    },
    paymentsSyncedAt: Date,

    activeSubscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
  },
  { timestamps: true },
);

export default models?.GroupStudent ||
  model("GroupStudent", GroupStudentSchema);
