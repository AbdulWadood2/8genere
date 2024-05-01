const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: [{ type: String }],
    profileImage: { type: String, default: null },
    forgetPassword: { type: String, default: null },
    love: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);
const data = mongoose.model("user", adminSchema);
module.exports = data;
