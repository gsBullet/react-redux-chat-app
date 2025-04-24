const express = require("express");
const router = express.Router();

router.post("/messages", (req, res) => {
    console.log(`req.body`, req.body);
});
router.get("/messages", (req, res) => {
    console.log(`req.body`);
});
router.delete("/messages/:id", (req, res) => {});

module.exports = () => router;
