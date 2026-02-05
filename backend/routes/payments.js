const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const verifyToken = require("../auth/verifyToken"); // ✅ ใช้งาน verifyToken


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// UPLOAD payment slip
router.post("/", verifyToken, upload.single("slip_image"), (req, res) => {
  const { order_id, village, district, province, contact_number, transport } = req.body;
  const { user_id } = req.user;
  const slip_image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!order_id || !contact_number || !village || !district || !province || !transport) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Transaction failed" });

    // 1️⃣ เช็คว่า order เป็นของ user และยัง pending
    const checkOrder = `
      SELECT order_id 
      FROM orders 
      WHERE order_id = ? AND user_id = ? AND status = 'pending'
    `;

    db.query(checkOrder, [order_id, user_id], (err, result) => {
      if (err || result.length === 0) {
        return db.rollback(() =>
          res.status(403).json({ error: "Invalid order" })
        );
      }

      // 2️⃣ บันทึก payment
      const insertPayment = `
        INSERT INTO payments
        (order_id, contact_number, village, district, province, transport, slip_image, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'paid')
      `;

      db.query(
        insertPayment,
        [order_id, contact_number, village, district, province, transport, slip_image],
        (err) => {
          if (err) {
            return db.rollback(() =>
              res.status(500).json({ error: "Failed to save payment" })
            );
          }

          // 3️⃣ อัปเดต order เป็น paid
          const updateOrder = `
            UPDATE orders SET status = 'paid' WHERE order_id = ?
          `;

          db.query(updateOrder, [order_id], (err) => {
            if (err) {
              return db.rollback(() =>
                res.status(500).json({ error: "Failed to update order" })
              );
            }

            // 4️⃣ commit
            db.commit((err) => {
              if (err) {
                return db.rollback(() =>
                  res.status(500).json({ error: "Commit failed" })
                );
              }

              res.json({
                success: true,
                message: "✅ Upload slip success, order paid",
                order_id
              });
            });
          });
        }
      );
    });
  });
});


router.get("/order_summary", verifyToken, (req, res) => {
  const { user_id } = req.user;

  const query = `
    SELECT 
      o.order_id,
      p.product_id,
      p.name_product AS product_name,
      oi.qty,
      oi.price,
      (oi.qty * oi.price) AS item_total,
      o.total_price
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.user_id = ? AND o.status = 'paid'
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json({
      user_id,
      order_id: results[0]?.order_id,
      items: results,
      total_price: results[0]?.total_price || 0
    });
  });
});


module.exports = router;
