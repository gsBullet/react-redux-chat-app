const express = require("express");
const converstionsController = require("../../controller/converstionsController");
const router = express.Router();

router.post("/conversations", converstionsController.createConversation);
router.get("/conversations", converstionsController.getConversations);
router.delete("/conversations/:id", converstionsController.deleteConversation);
router.put("/conversations/:id", converstionsController.updateConversation);

module.exports = () => router;
