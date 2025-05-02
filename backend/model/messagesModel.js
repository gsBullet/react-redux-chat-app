const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "conversations",
      required: true,
    },
    sender: {
      email: { type: String, required: true },
      name: { type: String, required: true },
      _id: { type: String, required: true },
      authImage: {
        type: String,
        default:
          "https://www.vectorstock.com/royalty-free-vector/approved-chat-app-icon-vector-28873697",
      },
    },
    receiver: {
      email: { type: String, required: true },
      name: { type: String, required: true },
      _id: { type: String, required: true },
      authImage: {
        type: String,
        default:
          "https://www.vectorstock.com/royalty-free-vector/approved-chat-app-icon-vector-28873697",
      },
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", messageSchema);
