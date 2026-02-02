const express = require("express");
const router = express.Router();
const db = require("../db");

// GET products
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// POST product
router.post("/", (req, res) => {
  const { name_product, price, image, description, role } = req.body;
  db.query(
    "INSERT INTO products SET ?",
    { name_product, price, image, description, role },
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "✅ Product added" });
    }
  );
});

module.exports = router;
