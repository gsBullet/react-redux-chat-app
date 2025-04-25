const conversationsModel = require("../model/conversationsModel");

module.exports = {
  getConversations: async (req, res) => {
    const queryString = req.query;

    const params = new URLSearchParams(queryString);

    // Extract values
    const participantEmail = params.get("participants_like");
    const page = parseInt(params.get("_page")) || 1;
    const limit = parseInt(params.get("_limit")) || 10;

    try {
      const conversations = await conversationsModel
        .find({
          participants: { $regex: participantEmail, $options: "i" },
        })
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.status(200).json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Error fetching conversations" });
    }
  },

  createConversation: async (req, res) => {
    try {
      const body = req.body;

      const conversation = await conversationsModel.create(body);

      return res
        .status(201)
        .json({ message: "Conversation created successfully", conversation });
    } catch (error) {
      res.status(500).json({ error: "Error creating conversation" });
    }
  },
  deleteConversation: async (req, res) => {
    try {
      const { id } = req.params;
      await conversationsModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting conversation" });
    }
  },
  updateConversation: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedConversation = await conversationsModel.findByIdAndUpdate(
        { _id: id },
        req.body,
        { new: true }
      );
      res.status(200).json(updatedConversation);
    } catch (error) {
      res.status(500).json({ error: "Error updating conversation" });
    }
  },
};
