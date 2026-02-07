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
          UPDATE orders SET status = 'success'
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
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.json({
        user_id,
        order_id: null,
        items: [],
        total_price: 0,
      });
    }

    res.json({
      user_id,
      order_id: results[0].order_id,
      items: results,
      total_price: results[0].total_price,
    });
  });
});

module.exports = router;
