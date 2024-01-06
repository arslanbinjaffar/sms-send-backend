import { Schema, model } from "mongoose";

const logSchema = new Schema(
  {
    reqData: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Log = model("logs", logSchema);
