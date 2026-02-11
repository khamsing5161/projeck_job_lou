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
  const sql = `
    SELECT
      p.product_id,
      p.name_product AS name,
      p.price AS original_price,
      p.image,
      promo.discount_type,
      promo.discount_value,
      promo.end_date,
      CASE
        WHEN promo.promotion_id IS NULL THEN p.price
        WHEN promo.end_date < NOW() THEN p.price
        WHEN promo.discount_type = 'percent'
          THEN ROUND(p.price - (p.price * promo.discount_value / 100), 2)
        WHEN promo.discount_type = 'fixed'
          THEN GREATEST(p.price - promo.discount_value, 0)
        ELSE p.price
      END AS final_price
    FROM products p
    LEFT JOIN product_promotions pp
      ON p.product_id = pp.product_id
    LEFT JOIN promotions promo
      ON pp.promo_id = promo.promotion_id
      AND promo.active = 1
      AND promo.start_date <= NOW()
      AND promo.end_date >= NOW()
    WHERE p.role = 'condom'
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


router.get("/lubricating_gel", (req, res) => {
  db.query(`
    SELECT
      p.product_id,
      p.name_product AS name,
      p.price AS original_price,
      p.image,
      promo.discount_type,
      promo.discount_value,
      promo.end_date,
      CASE
        WHEN promo.promotion_id IS NULL THEN p.price
        WHEN promo.end_date < NOW() THEN p.price
        WHEN promo.discount_type = 'percent'
          THEN ROUND(p.price - (p.price * promo.discount_value / 100), 2)
        WHEN promo.discount_type = 'fixed'
          THEN GREATEST(p.price - promo.discount_value, 0)
        ELSE p.price
      END AS final_price
    FROM products p
    LEFT JOIN product_promotions pp
      ON p.product_id = pp.product_id
    LEFT JOIN promotions promo
      ON pp.promo_id = promo.promotion_id
      AND promo.active = 1
      AND promo.start_date <= NOW()
      AND promo.end_date >= NOW()
    WHERE p.role = 'lubricating_gel'`, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  })
})

router.get("/strength_medicine", (req, res) => {
  db.query(`
    SELECT
      p.product_id,
      p.name_product AS name,
      p.price AS original_price,
      p.image,
      promo.discount_type,
      promo.discount_value,
      promo.end_date,
      CASE
        WHEN promo.promotion_id IS NULL THEN p.price
        WHEN promo.end_date < NOW() THEN p.price
        WHEN promo.discount_type = 'percent'
          THEN ROUND(p.price - (p.price * promo.discount_value / 100), 2)
        WHEN promo.discount_type = 'fixed'
          THEN GREATEST(p.price - promo.discount_value, 0)
        ELSE p.price
      END AS final_price
    FROM products p
    LEFT JOIN product_promotions pp
      ON p.product_id = pp.product_id
    LEFT JOIN promotions promo
      ON pp.promo_id = promo.promotion_id
      AND promo.active = 1
      AND promo.start_date <= NOW()
      AND promo.end_date >= NOW()

    WHERE p.role = 'strength_medicine'`, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  })
})

router.get("/thrilling_equipment", (req, res) => {
  db.query(`
   SELECT
      p.product_id,
      p.name_product AS name,
      p.price AS original_price,
      p.image,
      promo.discount_type,
      promo.discount_value,
      promo.end_date,
      CASE
        WHEN promo.promotion_id IS NULL THEN p.price
        WHEN promo.end_date < NOW() THEN p.price
        WHEN promo.discount_type = 'percent'
          THEN ROUND(p.price - (p.price * promo.discount_value / 100), 2)
        WHEN promo.discount_type = 'fixed'
          THEN GREATEST(p.price - promo.discount_value, 0)
        ELSE p.price
      END AS final_price
    FROM products p
    LEFT JOIN product_promotions pp
      ON p.product_id = pp.product_id
    LEFT JOIN promotions promo
      ON pp.promo_id = promo.promotion_id
      AND promo.active = 1
      AND promo.start_date <= NOW()
      AND promo.end_date >= NOW()

    WHERE p.role = 'thrilling_equipment'`, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  })
})

router.get("/product/:id", (req, res) => {
  const product_id = req.params.id;

  const sql = `
    SELECT
      p.product_id,
      p.name_product AS name,
      p.price AS original_price,
      p.image,
      promo.discount_type,
      promo.discount_value,
      promo.end_date,
      CASE
        WHEN promo.promotion_id IS NULL THEN p.price
        WHEN promo.end_date < NOW() THEN p.price
        WHEN promo.discount_type = 'percent'
          THEN ROUND(p.price - (p.price * promo.discount_value / 100), 2)
        WHEN promo.discount_type = 'fixed'
          THEN GREATEST(p.price - promo.discount_value, 0)
        ELSE p.price
      END AS final_price
    FROM products p
    LEFT JOIN product_promotions pp
      ON p.product_id = pp.product_id
    LEFT JOIN promotions promo
      ON pp.promo_id = promo.promotion_id
      AND promo.active = 1
      AND promo.start_date <= NOW()
      AND promo.end_date >= NOW()

    WHERE p.product_id = ?
    LIMIT 1
  `;

  db.query(sql, [product_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(results[0]);
  });
});



router.get("/ladies", (req, res) => {
  db.query(`
    SELECT
      p.product_id,
      p.name_product AS name,
      p.price AS original_price,
      p.image,
      promo.discount_type,
      promo.discount_value,
      promo.end_date,
      CASE
        WHEN promo.promotion_id IS NULL THEN p.price
        WHEN promo.end_date < NOW() THEN p.price
        WHEN promo.discount_type = 'percent'
          THEN ROUND(p.price - (p.price * promo.discount_value / 100), 2)
        WHEN promo.discount_type = 'fixed'
          THEN GREATEST(p.price - promo.discount_value, 0)
        ELSE p.price
      END AS final_price
    FROM products p
    LEFT JOIN product_promotions pp
      ON p.product_id = pp.product_id
    LEFT JOIN promotions promo
      ON pp.promo_id = promo.promotion_id
      AND promo.active = 1
      AND promo.start_date <= NOW()
      AND promo.end_date >= NOW()

    WHERE p.Gender = 'Woman'`, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  })
})

router.get("/man", (req, res) => {
  const sql = `
    SELECT
      p.product_id,
      p.name_product AS name,
      p.price AS original_price,
      p.image,
      promo.discount_type,
      promo.discount_value,
      promo.end_date,
      CASE
        WHEN promo.promotion_id IS NULL THEN p.price
        WHEN promo.end_date < NOW() THEN p.price
        WHEN promo.discount_type = 'percent'
          THEN ROUND(p.price - (p.price * promo.discount_value / 100), 2)
        WHEN promo.discount_type = 'fixed'
          THEN GREATEST(p.price - promo.discount_value, 0)
        ELSE p.price
      END AS final_price
    FROM products p
    LEFT JOIN product_promotions pp
      ON p.product_id = pp.product_id
    LEFT JOIN promotions promo
      ON pp.promo_id = promo.promotion_id
      AND promo.active = 1
      AND promo.start_date <= NOW()
      AND promo.end_date >= NOW()

    WHERE p.Gender = 'Man'
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("GET /man error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});




// promotion product


router.post("/promotions", (req, res) => {
  const {
    product_id,
    discount_type,   // 'percentage' | 'fixed'
    discount_value,
    start_date,
    end_date
  } = req.body;

  const sql = `
    INSERT INTO promotions
    (product_id, discount_type, discount_value, start_date, end_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [product_id, discount_type, discount_value, start_date, end_date],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "✅ Promotion created", promo_id: result.insertId });
    }
  );
});



router.get("/sale", (req, res) => {
  const sql = `
    SELECT
      p.product_id,
      p.name_product AS name,
      p.price AS original_price,
      p.image,
      promo.discount_type,
      promo.discount_value,
      promo.end_date,
      CASE
        WHEN promo.promotion_id IS NULL THEN p.price
        WHEN promo.end_date < NOW() THEN p.price
        WHEN promo.discount_type = 'percent'
          THEN ROUND(p.price - (p.price * promo.discount_value / 100), 2)
        WHEN promo.discount_type = 'fixed'
          THEN GREATEST(p.price - promo.discount_value, 0)
        ELSE p.price
      END AS final_price
    FROM products p
    LEFT JOIN product_promotions pp
      ON p.product_id = pp.product_id
    LEFT JOIN promotions promo
      ON pp.promo_id = promo.promotion_id
      AND promo.active = 1
      AND promo.start_date <= NOW()
      AND promo.end_date >= NOW()
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


module.exports = router;
