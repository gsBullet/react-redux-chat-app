const express = require("express");
const messagesController = require("../../controller/messagesController");
const router = express.Router();

router.post("/messages", messagesController.addMessage);
router.get("/messages", messagesController.getMessages);
router.delete("/messages/:id", (req, res) => {});

module.exports = () => router;
