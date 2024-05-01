const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: [{ type: String, required: true }],
  },
  { timestamps: true }
);
const data = mongoose.model("post", postSchema);
module.exports = data;
