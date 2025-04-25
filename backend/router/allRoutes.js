const express = require("express");
const authRoutes = require("./routes/authRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const conversationsRoutes = require("./routes/conversationsRoutes");
const socketRoutes = require("./routes/socketRoutes");
const router = express.Router();

router.use(authRoutes());
router.use(conversationsRoutes());
// router.use(socketRoutes());
router.use(messagesRoutes());

module.exports = () => router;
