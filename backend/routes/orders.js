const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * CREATE ORDER
 * status เริ่มต้น = pending
 */
router.post("/", (req, res) => {
  const { cartTotal, items } = req.body;

  if (!cartTotal || !items || items.length === 0) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  db.query(
    "INSERT INTO orders (cartTotal, status) VALUES (?, 'pending')",
    [cartTotal],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const order_id = result.insertId;

      const values = items.map(item => [
        order_id,
        item.product_id,
        item.qty,
        item.totalprice
      ]);

      db.query(
        "INSERT INTO orders_items (order_id, product_id, qty, totalprice) VALUES ?",
        [values],
        err => {
          if (err) return res.status(500).json(err);

          res.json({
            message: "✅ Order created",
            order_id,
            status: "pending"
          });
        }
      );
    }
  );
});

/**
 * UPDATE ORDER STATUS (Admin)
 */
router.put("/:id/status", (req, res) => {
  const { status } = req.body;
  const order_id = req.params.id;

  const allowStatus = ["pending", "paid", "success", "cancel"];
  if (!allowStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  db.query(
    "UPDATE orders SET status=? WHERE order_id=?",
    [status, order_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({
        message: "✅ Order status updated",
        order_id,
        status
      });
    }
  );
});

/**
 * GET ORDERS BY STATUS
 */
router.get("/status/:status", (req, res) => {
  const { status } = req.params;

  const allowStatus = ["pending", "paid", "success", "cancel"];
  if (!allowStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  db.query(
    "SELECT * FROM orders WHERE status=? ORDER BY created_at DESC",
    [status],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

/**
 * GET ORDER + ITEMS (ใช้หน้า Order Detail)
 */
router.get("/:id", (req, res) => {
  const order_id = req.params.id;

  const sql = `
    SELECT 
      o.order_id, o.cartTotal, o.status, o.created_at,
      oi.qty, oi.totalprice,
      p.name_product, p.price, p.image
    FROM orders o
    JOIN orders_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.order_id = ?
  `;

  db.query(sql, [order_id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(result);
  });
});

module.exports = router;
