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
      _id: { type: String, required: true }, // assuming this comes from JSON DB or your own ID system
    },
    receiver: {
      email: { type: String, required: true },
      name: { type: String, required: true },
      _id: { type: String, required: true },
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
