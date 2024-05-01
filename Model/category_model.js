const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);
const data = mongoose.model("category", categorySchema);
module.exports = data;
