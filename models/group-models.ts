import { Schema, model, models } from "mongoose";

const GroupSchema = new Schema({
  name: { type: String, unique: true, required: true },
  students: [
    {
      student: { type: Schema.Types.ObjectId, ref: "Student" },
      mark: { type: String },
    },
  ],
});

export default models?.Group || model("Group", GroupSchema);
