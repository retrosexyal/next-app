// models/express-cache-model.ts
import { Schema, model, models } from "mongoose";

const ExpressCacheSchema = new Schema({
  key: { type: String, unique: true },
  data: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

// авто-удаление через 10 минут
ExpressCacheSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 600 },
);

export default models.ExpressCache ||
  model("ExpressCache", ExpressCacheSchema);
