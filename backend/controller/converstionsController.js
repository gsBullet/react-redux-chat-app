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
      console.log("Error fetching conversations:", error);
      res.status(500).json({ message: "Error fetching conversations", error });
    }
  },
  getConversation: async (req, res) => {
    const queryString = req.query;

    const params = new URLSearchParams(queryString);
    // Extract values
    const participantEmail = params.get("participants_like");

    const particapantA = participantEmail.split(",")[0];
    const particapantB = participantEmail.split(",")[1];

    try {
      const conversation = await conversationsModel.findOne({
        $or: [{ participants: particapantA }, { participants: particapantB }],
      });

      return res.status(200).json(conversation);
    } catch (error) {
      console.log("Error fetching conversations:", error);
      return res
        .status(500)
        .json({ message: "Error fetching conversations", error });
    }
  },

  createConversation: async (req, res) => {
    const path = req.path;
    const method = req.method;
    const body = {
      ...req.body,
      timestamp: req.body.timestamp,
    };

    try {
      const conversation = await conversationsModel.create(body);
      if (path.includes("/conversations") && method === "POST") {
        global.io.emit("conversations", {
          data: conversation,
        });
      }

      return res
        .status(201)
        .json({ message: "Conversation created successfully", conversation });
    } catch (error) {
      res.status(500).json({message: "Error deleting conversation",error});
    }
  },
  deleteConversation: async (req, res) => {
    try {
      const { id } = req.params;
      await conversationsModel.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ message: "Conversation deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting conversation",error });
    }
  },
  updateConversation: async (req, res) => {
    try {
      const path = req.path;
      const method = req.method;

      const { id } = req.params;
      const updatedConversation = await conversationsModel.findByIdAndUpdate(
        { _id: id },
        req.body,
        { new: true }
      );
      if (path.includes("/conversations") && method === "PATCH") {
        global.io.emit("conversations", {
          data: updatedConversation,
        });
      }
      return res.status(200).json(updatedConversation);
    } catch (error) {
      res.status(500).json({message: "Error deleting conversation",error});
    }
  },
};
