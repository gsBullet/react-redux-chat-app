const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    userRole: {
      type: String,
      default: "users",
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
    authImage: {
      type: String,
      default:
        "https://www.vectorstock.com/royalty-free-vector/approved-chat-app-icon-vector-28873697",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("users", userSchema);
