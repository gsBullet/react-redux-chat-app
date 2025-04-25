const express = require("express");
const converstionsController = require("../../controller/converstionsController");
const router = express.Router();

router.post("/conversations", converstionsController.createConversation);
router.get("/conversations", converstionsController.getConversations);
router.patch("/conversations/:id", converstionsController.updateConversation);
router.delete("/conversations/:id", converstionsController.deleteConversation);

module.exports = () => router;
