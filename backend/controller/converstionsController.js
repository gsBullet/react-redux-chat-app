const conversationsModel = require("../model/conversationsModel");

module.exports = {
  getConversations: async (req, res) => {
    try {
      const { userId } = req.body;
      const conversations = await conversationsModel.find({
        members: { $in: [userId] },
      });
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Error fetching conversations" });
    }
  },

  createConversation: async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
      const newConversation = new conversationsModel({
        members: [senderId, receiverId],
      });
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
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
