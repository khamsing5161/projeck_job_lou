const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../auth/verifyToken"); // ✅ ใช้งาน verifyToken




router.post("/cart_input", verifyToken, (req, res) => {
  const { product_id, qty } = req.body;
  const { user_id } = req.user;

  if (!product_id || !qty || qty <= 0) {
    return res.status(400).json({ error: "Invalid product or quantity" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Transaction error" });

    // 1. หา order pending
    const findOrderSql = `
      SELECT order_id 
      FROM orders 
      WHERE user_id = ? AND status = 'pending'
      LIMIT 1
    `;

    db.query(findOrderSql, [user_id], (err, orderResult) => {
      if (err) {
        return db.rollback(() =>
          res.status(500).json({ error: "Find order error" })
        );
      }

      // ฟังก์ชันเพิ่มสินค้า
      const addItemToOrder = (order_id) => {
        const priceSql = `
          SELECT price 
          FROM products 
          WHERE product_id = ?
          LIMIT 1
        `;

        db.query(priceSql, [product_id], (err, productRes) => {
          if (err || productRes.length === 0) {
            return db.rollback(() =>
              res.status(404).json({ error: "Product not found" })
            );
          }

          const price = productRes[0].price;

          const checkItemSql = `
            SELECT order_item_id, qty 
            FROM order_items 
            WHERE order_id = ? AND product_id = ?
            LIMIT 1
          `;

          db.query(checkItemSql, [order_id, product_id], (err, itemResult) => {
            if (err) {
              return db.rollback(() =>
                res.status(500).json({ error: "Check item error" })
              );
            }

            if (itemResult.length > 0) {
              // อัปเดตจำนวน
              const updateSql = `
                UPDATE order_items 
                SET qty = qty + ?, price = ?
                WHERE order_id = ? AND product_id = ?
              `;
              db.query(
                updateSql,
                [qty, price, order_id, product_id],
                (err) => {
                  if (err) {
                    return db.rollback(() =>
                      res.status(500).json({ error: "Update item failed" })
                    );
                  }
                  db.commit(() =>
                    res.json({ success: true, message: "Item updated in cart" })
                  );
                }
              );
            } else {
              // เพิ่มสินค้าใหม่
              const insertSql = `
                INSERT INTO order_items (order_id, product_id, qty, price)
                VALUES (?, ?, ?, ?)
              `;
              db.query(
                insertSql,
                [order_id, product_id, qty, price],
                (err) => {
                  if (err) {
                    return db.rollback(() =>
                      res.status(500).json({ error: "Insert item failed" })
                    );
                  }
                  db.commit(() =>
                    res.json({ success: true, message: "Item added to cart" })
                  );
                }
              );
            }
          });
        });
      };

      // 2. ถ้ามี order pending → ใช้เลย
      if (orderResult.length > 0) {
        const order_id = orderResult[0].order_id;
        console.log("📦 Using existing order:", order_id);
        addItemToOrder(order_id);
      } 
      // 3. ถ้าไม่มี → สร้างใหม่
      else {
        const createOrderSql = `
          INSERT INTO orders (user_id, status, total_price, date)
          VALUES (?, 'pending', 0, NOW())
        `;

        db.query(createOrderSql, [user_id], (err, createResult) => {
          if (err) {
            return db.rollback(() =>
              res.status(500).json({ error: "Create order failed" })
            );
          }

          const order_id = createResult.insertId;
          console.log("🆕 Order created:", order_id);
          addItemToOrder(order_id);
        });
      }
    });
  });
});






router.get("/cart", verifyToken, (req, res) => {
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



router.delete('/cart/remove_item/:order_item_id', verifyToken, (req, res) => {
  const { order_item_id } = req.params;
  const { user_id } = req.user;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Transaction failed" });
    }

    // เช็ค ownership
    const checkOwnership = `
      SELECT oi.order_id
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      WHERE oi.order_item_id = ? 
      AND o.user_id = ? 
      AND o.status = 'pending'
    `;

    db.query(checkOwnership, [order_item_id, user_id], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: "Database error" });
        });
      }

      if (result.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: "Item not found" });
        });
      }

      const order_id = result[0].order_id;

      // ลบ item
      const deleteItem = `DELETE FROM order_items WHERE order_item_id = ?`;

      db.query(deleteItem, [order_item_id], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: "Failed to delete item" });
          });
        }

        // อัปเดต total
        const updateTotal = `
          UPDATE orders
          SET total_price = (
            SELECT COALESCE(SUM(qty * price), 0)
            FROM order_items
            WHERE order_id = ?
          )
          WHERE order_id = ?
        `;

        db.query(updateTotal, [order_id, order_id], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: "Failed to update total" });
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: "Commit failed" });
              });
            }

            res.json({
              success: true,
              message: "Item removed from cart"
            });
          });
        });
      });
    });
  });
});

router.delete('cart/clear', verifyToken, (req, res) => {
  const { user_id } = req.user;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Transaction failed" });
    }

    // หา order pending
    const findOrder = `
      SELECT order_id 
      FROM orders 
      WHERE user_id = ? AND status = 'pending'
    `;

    db.query(findOrder, [user_id], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: "Database error" });
        });
      }

      if (result.length === 0) {
        return db.rollback(() => {
          res.json({ message: "Cart is already empty" });
        });
      }

      const order_id = result[0].order_id;

      // ลบ order_items ทั้งหมด
      const deleteItems = `DELETE FROM order_items WHERE order_id = ?`;

      db.query(deleteItems, [order_id], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: "Failed to clear cart" });
          });
        }

        // ลบ order
        const deleteOrder = `DELETE FROM orders WHERE order_id = ?`;

        db.query(deleteOrder, [order_id], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: "Failed to delete order" });
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: "Commit failed" });
              });
            }

            res.json({
              success: true,
              message: "Cart cleared successfully"
            });
          });
        });
      });
    });
  });
});

router.put('/cart/update_qty', verifyToken, (req, res) => {
  const { order_item_id, qty } = req.body;
  const { user_id } = req.user;

  if (!order_item_id || !qty) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (qty <= 0) {
    return res.status(400).json({ error: "Quantity must be greater than 0" });
  }

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Transaction failed" });
    }

    // เช็คว่า item นี้เป็นของ user จริงหรือไม่
    const checkOwnership = `
      SELECT oi.order_id, oi.product_id
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      WHERE oi.order_item_id = ? 
      AND o.user_id = ? 
      AND o.status = 'pending'
    `;

    db.query(checkOwnership, [order_item_id, user_id], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: "Database error" });
        });
      }

      if (result.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: "Item not found or not yours" });
        });
      }

      const order_id = result[0].order_id;

      // อัปเดต qty
      const updateQty = `
        UPDATE order_items
        SET qty = ?
        WHERE order_item_id = ?
      `;

      db.query(updateQty, [qty, order_item_id], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: "Failed to update quantity" });
          });
        }

        // อัปเดต total
        const updateTotal = `
          UPDATE orders
          SET total_price = (
            SELECT COALESCE(SUM(qty * price), 0)
            FROM order_items
            WHERE order_id = ?
          )
          WHERE order_id = ?
        `;

        db.query(updateTotal, [order_id, order_id], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: "Failed to update total" });
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: "Commit failed" });
              });
            }

            res.json({
              success: true,
              message: "Quantity updated",
              order_item_id: order_item_id,
              new_qty: qty
            });
          });
        });
      });
    });
  });
});


// router.put('/cart_update', verifyToken, (req, res) => {
//   const { order_id } = req.body;     // ✔ ดึง order_id ที่ส่งมาจาก frontend
//   const { user_id } = req.user;      // ✔ ดึง user_id จาก token

//   const updateOrderQuery = `
//     UPDATE orders
//     SET status = 'paid'
//     WHERE order_id = ? AND user_id = ?
//   `;

//   db.query(updateOrderQuery, [order_id, user_id], (err, result) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Database error" });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(403).json({
//         error: "Not allowed — this order does not belong to you"
//       });
//     }

//     res.json({ message: "Order status updated to paid" });
//   });
// });



router.get("/order_count", verifyToken, (req, res) => {
  const { user_id } = req.user;

  db.query(
    "SELECT COUNT(*) AS total_orders FROM orders WHERE user_id = ? AND status = 'pending'",
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ total_orders: result[0].total_orders });
    }
  );
});






module.exports = router;
