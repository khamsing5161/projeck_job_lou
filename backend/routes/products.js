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

router.get("/condom", (req, res) => {
  db.query("SELECT * FROM products WHERE role = 'condom'", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  })
});

router.get("/lubricating_gel", (req, res) => {
  db.query("SELECT * FROM products WHERE role = 'lubricating_gel'", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  })
})

router.get("/strength_medicine", (req, res) => {
  db.query("SELECT * FROM products WHERE role = 'strength_medicine'", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  })
})

router.get("/thrilling_equipment", (req, res) => {
  db.query("SELECT * FROM products WHERE role = 'thrilling_equipment'", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  })
})

router.get("/product/:id", (req, res) => {
  const product_id = req.params.id;

  const query = `
    SELECT
      p.product_id,
      p.name_product AS name,
      p.price,
      p.description,
      p.image
    FROM products AS p
    WHERE p.product_id = ?
  `;

  db.query(query, [product_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(results[0]);
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
