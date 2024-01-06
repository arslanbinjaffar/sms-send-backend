const { Schema, model } = require("mongoose");

const logSchema = new Schema(
  {
    reqData: Schema.Types.Mixed,
  },
  { timestamps: true }
);

exports.Log = model("logs", logSchema);
