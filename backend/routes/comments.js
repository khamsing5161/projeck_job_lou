const express = require("express");
const router = express.Router();
const db = require("../db");

// GET comments
router.get("/", (req, res) => {
  db.query("SELECT * FROM comments_user ORDER BY created_at DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// POST comment
router.post("/", (req, res) => {
  const { content_text, popular } = req.body;
  db.query(
    "INSERT INTO comments_user (content_text, popular) VALUES (?, ?)",
    [content_text, popular],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "✅ Comment added" });
    }
  );
});




module.exports = router;
