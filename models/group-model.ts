import { Schema, model, models, Types } from "mongoose";

export interface IGroup {
  title: string;
  ownerEmail: string;
  students: Types.ObjectId[]; // GroupStudent
}

const GroupSchema = new Schema<IGroup>({
  title: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "GroupStudent" }],
});

export default models?.Group || model<IGroup>("Group", GroupSchema);
