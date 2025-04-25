const express = require("express");
const socketController = require("../../controller/socketController");

const router = express.Router();

router.post("/conversations", socketController.addConversationBySocket);
router.patch("/conversations", socketController.updateConversationBySocket);

router.post("/messages", socketController.addMessagesBySocket);

module.exports = () => router;
