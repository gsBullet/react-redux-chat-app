module.exports= {
    getMessages: async (req, res) => {
        try {
            const messages = await Message.find();
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: "Error fetching messages" });
        }
    },

    sendMessage: async (req, res) => {
        try {
            const newMessage = new Message(req.body);
            await newMessage.save();
            res.status(201).json(newMessage);
        } catch (error) {
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
            const updatedMessage = await Message.findByIdAndUpdate
                (id, req.body, { new: true });
            res.status(200).json(updatedMessage);
        } catch (error) {
            res.status(500).json({ message: "Error updating message" });
        }   
    }
}