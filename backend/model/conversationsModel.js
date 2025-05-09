const { mongoose } = require("mongoose");

module.exports = mongoose.model(
  "conversations",
  mongoose.Schema(
    {
      participants: {
        type: String,
      },
      users: {
        type: [],
      },
      message: {
        type: String,
      },
      timestamp: {
        type: Number,
        required: true,
      },
    },

    { timestamps: true }
  )
);
