const messagesModel = require("../model/messagesModel");

module.exports = {
  getMessages: async (req, res) => {
    const queryString = req.query;

    const params = new URLSearchParams(queryString);
    // Extract values
    const page = parseInt(params.get("_page")) || 1;
    const limit = parseInt(params.get("_limit")) || 10;
    const conversationId = params.get("conversationId");
    const sort = params.get("_sort") || "timestamp";
    const order = params.get("_order") || "desc";

    const message = await messagesModel
      .find({
        conversationId,
      })
      .sort({ [sort]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json(message);
  },

  addMessage: async (req, res) => {
    const body = {
      ...req.body,
      timestamp: req.body.timestamp,
    };
    try {
      const path = req.path;
      const method = req.method;

      if (path.includes("/messages") && method === "POST") {
        global.io.emit("messages", {
          data: req.body,
        });
      }
      const savedMessage = await messagesModel.create(body);
      return res.status(201).json(savedMessage);
    } catch (error) {
      console.log("Error sending message:", error);
      res.status(500).json({ message: "Error sending message" });
    }
  },
  deleteMessage: async (req, res) => {
    try {
      const { id } = req.params;
      await Message.findByIdAndDelete(id);
      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting message" });
    }
  },
  updateMessage: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedMessage = await Message.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: "Error updating message" });
    }
  },
};
