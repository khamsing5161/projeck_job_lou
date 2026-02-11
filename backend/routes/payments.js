const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../db");
const verifyToken = require("../auth/verifyToken");




// ---------------------- Multer setup ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only images are allowed"));
    } else {
      cb(null, true);
    }
  },
});

// ---------------------- POST /success ----------------------
router.post(
  "/success",
  verifyToken,
  upload.single("slip_image"),
  (req, res) => {
    const { order_id, village, district, province, contact_number, transport } = req.body;
    const { user_id } = req.user;

    if (!order_id || !contact_number || !village || !district || !province || !transport) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No slip image uploaded" });
    }

    const slip_image = req.file ? `/uploads/${req.file.filename}` : "";
    if (!slip_image) {
      return res.status(400).json({ error: "No slip image uploaded" });
    }

    const insertQuery = `
      INSERT INTO payments 
      (order_id, user_id, slip_image, contact_number, village, district, province, transport)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [order_id, user_id, slip_image, contact_number, village, district, province, transport],
      (err) => {
        if (err) {
          console.error("Insert payment error:", err);
          return res.status(500).json({ error: "Database insert error" });
        }

        const updateOrderQuery = `
          UPDATE orders SET status = 'paid'
          WHERE order_id = ? AND user_id = ?
        `;

        db.query(updateOrderQuery, [order_id, user_id], (err2, result2) => {
          if (err2) {
            console.error("Update order error:", err2);
            return res.status(500).json({ error: "Database update order error" });
          }

          if (result2.affectedRows === 0) {
            return res.status(403).json({ error: "Order not found or not owned by user" });
          }

          res.json({
            success: true,
            message: "✅ Slip uploaded and order paid successfully",
            slip_image,
            order_id,
          });
        });
      }
    );
  }
);

// ---------------------- GET /order_summary ----------------------
router.get("/order_summary", verifyToken, (req, res) => {
  const { user_id } = req.user;

  const sql = `
    SELECT
      o.order_id,
      oi.order_item_id,
      oi.product_id,
      p.name_product,
      p.image,

      p.price AS original_price,
      oi.qty,

      pr.promotion_id,
      pr.discount_type,
      pr.discount_value,
      pr.start_date,
      pr.end_date,

      CASE
        WHEN pr.promotion_id IS NULL THEN p.price
        WHEN pr.discount_type = 'percent'
          THEN p.price - (p.price * pr.discount_value / 100)
        WHEN pr.discount_type = 'fixed'
          THEN GREATEST(p.price - pr.discount_value, 0)
        ELSE p.price
      END AS final_price,

      CASE
        WHEN pr.promotion_id IS NULL THEN 0
        WHEN pr.discount_type = 'percent'
          THEN (p.price * pr.discount_value / 100)
        WHEN pr.discount_type = 'fixed'
          THEN pr.discount_value
        ELSE 0
      END AS discount_per_item

    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id

    LEFT JOIN product_promotions pp ON p.product_id = pp.product_id
    LEFT JOIN promotions pr ON pp.promo_id = pr.promotion_id
      AND pr.active = 1
      AND NOW() BETWEEN pr.start_date AND pr.end_date

    WHERE o.user_id = ?
      AND o.status = 'pending'

    ORDER BY oi.order_item_id DESC
  `;

  db.query(sql, [user_id], (err, rows) => {
    if (err) {
      console.error("GET cart error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (rows.length === 0) {
      return res.json({
        order_id: null,
        items: [],
        summary: {
          subtotal_original: 0,
          subtotal_discounted: 0,
          total_discount: 0,
          total_price: 0
        }
      });
    }

    let subtotalOriginal = 0;
    let subtotalDiscounted = 0;

    const items = rows.map((row) => {
      const lineOriginal = row.original_price * row.qty;
      const lineFinal = row.final_price * row.qty;

      subtotalOriginal += lineOriginal;
      subtotalDiscounted += lineFinal;

      return {
        order_item_id: row.order_item_id,
        product_id: row.product_id,
        name: row.name_product,
        image: row.image,

        original_price: row.original_price,
        final_price: row.final_price,
        qty: row.qty,

        promo: row.promotion_id
          ? {
            discount_type: row.discount_type,
            discount_value: row.discount_value
          }
          : null,

        discount_per_item: row.discount_per_item,
        line_original_total: lineOriginal,
        line_final_total: lineFinal
      };
    });

    res.json({
      order_id: rows[0].order_id,
      items,
      summary: {
        subtotal_original: subtotalOriginal,
        subtotal_discounted: subtotalDiscounted,
        total_discount: subtotalOriginal - subtotalDiscounted,
        total_price: subtotalDiscounted
      }
    });
  });
});


module.exports = router;
