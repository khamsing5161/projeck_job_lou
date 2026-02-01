const express = require("express");
const router = express.Router();

router.get("/you", (req, res) => {
  res.json({ message: "Hello from routes! category" });
});

module.exports = router;