const express = require("express");
const authController = require("../../controller/authController");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();
// const passport = require("passport");
// require("../../config/passport");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/google-auth", authController.googleAuth);
router.post(
  "/github-auth",
  // passport.authenticate("github", { session: false }),
  authController.githubAuth
);
router.use(authMiddleware);
router.get("/users/:email", authController.getUser);

router.get("/logout", () => {
  console.log("logout");
});
module.exports = () => router;
