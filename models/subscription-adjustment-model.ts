import { Schema, Types, model, models } from "mongoose";

export interface ISubscriptionAdjustment {
  subscription: Types.ObjectId;
  admin: Types.ObjectId;

  delta: number; // +2, -1, +5
  reason: string;

  createdAt: Date;
}

const SubscriptionAdjustmentSchema = new Schema(
  {
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    delta: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default models?.SubscriptionAdjustment ||
  model<ISubscriptionAdjustment>(
    "SubscriptionAdjustment",
    SubscriptionAdjustmentSchema,
  );
