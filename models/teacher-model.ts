import { Schema, model, models } from "mongoose";

const TeacherSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export default models?.Teacher || model("Teacher", TeacherSchema);
