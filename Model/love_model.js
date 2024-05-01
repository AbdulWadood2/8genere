// love_model.js
const mongoose = require("mongoose");
const loveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    love: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const data = mongoose.model("love", loveSchema);

module.exports = data;
