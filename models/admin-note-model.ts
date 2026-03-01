import { Schema, model, models, Types } from "mongoose";
import { randomUUID } from "crypto";

export interface IAdminNote {
  uuid: string;
  text: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AdminNoteSchema = new Schema<IAdminNote>(
  {
    uuid: {
      type: String,
      required: true,
      default: () => randomUUID(),
      index: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export default models?.AdminNote ||
  model<IAdminNote>("AdminNote", AdminNoteSchema);
