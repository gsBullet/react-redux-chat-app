const express = require("express");
const authController = require("../../controller/authController");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/google-auth", authController.googleAuth);
router.use(authMiddleware);
router.get("/users/:email", authController.getUser);

router.get("/logout", () => {
  console.log("logout");
});
module.exports = () => router;
