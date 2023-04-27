import { Schema, model, models } from "mongoose";

const StudentSchema = new Schema({
  name: { type: String, unique: true, required: true },
  date: { type: String, required: true },
  mentor: { type: String },
  place: { type: String, required: true },
});

export default models.Student || model("Student", StudentSchema);
