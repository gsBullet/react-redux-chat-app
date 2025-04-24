const { mongoose } = require("mongoose");

module.exports = mongoose.model(
  "messages",
  mongoose.Schmema(
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: "users",
        // required: true,
      },
      receiver: {
        type: Schema.Types.ObjectId,
        ref: "users",
        // required: true,
      },
      message: {
        type: String,
        // required: true,
      },
      conversationId: {
        type: Schema.Types.ObjectId,
        ref: "conversations",
        // required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  )
);
