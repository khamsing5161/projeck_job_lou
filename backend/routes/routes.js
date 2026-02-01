const express = require("express");
const router = express.Router();

router.get("/me", (req, res) => {
  res.json({ message: "Hello from routes!" });
});

module.exports = router;