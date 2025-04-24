const express = require("express");
const authRoutes = require("./routes/authRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const conversationsRoutes = require("./routes/conversationsRoutes");
const router = express.Router();

router.use(authRoutes());
router.use(messagesRoutes());
router.use(conversationsRoutes());

module.exports = () => router;
