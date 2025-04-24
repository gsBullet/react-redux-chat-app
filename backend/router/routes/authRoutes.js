const express = require("express");
const authController = require("../../controller/authController");
const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);

router.get("/logout", () => {
  console.log("logout");
});
module.exports = () => router;
