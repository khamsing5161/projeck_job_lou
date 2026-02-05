const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../auth/verifyToken"); // ✅ ใช้งาน verifyToken

// เพิ่มสินค้าในตะกร้า
router.post('/cart_input', verifyToken, (req, res) => {
  const { product_id, qty, price } = req.body;
  const { user_id } = req.user;

  // ✅ 1. Validate input
  if (!product_id || !qty || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (qty <= 0 || price < 0) {
    return res.status(400).json({ error: "Invalid quantity or price" });
  }

  console.log(`🛒 Adding to cart: User ${user_id}, Product ${product_id}, Qty ${qty}`);

  // ✅ 2. Start Transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).json({ error: "Transaction failed" });
    }

    // ✅ 3. Verify product exists
    const checkProduct = `
      SELECT product_id, name_product, price 
      FROM products 
      WHERE product_id = ?
    `;

    db.query(checkProduct, [product_id], (err, productResult) => {
      if (err) {
        return db.rollback(() => {
          console.error("Check product error:", err);
          res.status(500).json({ error: "Database error" });
        });
      }

      if (productResult.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: "Product not found" });
        });
      }

      console.log(`✅ Product found: ${productResult[0].name}`);

      // ✅ 4. Find or create pending order
      const findOrder = `
        SELECT order_id, total_price
        FROM orders 
        WHERE user_id = ? AND status = 'pending'
        LIMIT 1
      `;

      db.query(findOrder, [user_id], (err, orderResult) => {
        if (err) {
          return db.rollback(() => {
            console.error("Find order error:", err);
            res.status(500).json({ error: "Database error" });
          });
        }

        if (orderResult.length > 0) {
          // Has pending order
          const order_id = orderResult[0].order_id;
          console.log(`📦 Using existing order: ${order_id}`);
          addItemToOrder(order_id);
        } else {
          // Create new order
          console.log(`🆕 Creating new order for user ${user_id}`);
          const createOrder = `
            INSERT INTO orders (user_id, status, total_price, date)
            VALUES (?, 'pending', 0, NOW())
          `;

          db.query(createOrder, [user_id], (err, createResult) => {
            if (err) {
              return db.rollback(() => {
                console.error("Create order error:", err);
                res.status(500).json({ error: "Failed to create order" });
              });
            }

            const order_id = createResult.insertId;
            console.log(`✅ Order created: ${order_id}`);
            addItemToOrder(order_id);
          });
        }
      });
    });

    // ✅ 5. Add or update item in order
    function addItemToOrder(order_id) {
      const checkItem = `
        SELECT order_item_id, qty, price
        FROM order_items 
        WHERE order_id = ? AND product_id = ?
        LIMIT 1
      `;

      db.query(checkItem, [order_id, product_id], (err, itemResult) => {
        if (err) {
          return db.rollback(() => {
            console.error("Check item error:", err);
            res.status(500).json({ error: "Database error" });
          });
        }

        if (itemResult.length > 0) {
          // Item exists → Update quantity
          const oldQty = itemResult[0].qty;
          const newQty = oldQty + qty;

          console.log(`🔄 Updating quantity: ${oldQty} → ${newQty}`);

          const updateQty = `
            UPDATE order_items
            SET qty = qty + ?, price = ?
            WHERE order_id = ? AND product_id = ?
          `;

          db.query(updateQty, [qty, price, order_id, product_id], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Update qty error:", err);
                res.status(500).json({ error: "Failed to update quantity" });
              });
            }

            console.log(`✅ Quantity updated`);
            updateOrderTotal(order_id);
          });

        } else {
          // Item doesn't exist → Insert new
          console.log(`➕ Adding new item to order`);

          const insertItem = `
            INSERT INTO order_items (order_id, product_id, qty, price)
            VALUES (?, ?, ?, ?)
          `;

          db.query(insertItem, [order_id, product_id, qty, price], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Insert item error:", err);
                res.status(500).json({ error: "Failed to add item" });
              });
            }

            console.log(`✅ Item added to order`);
            updateOrderTotal(order_id);
          });
        }
      });
    }

    // ✅ 6. Update order total price
    function updateOrderTotal(order_id) {
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
            console.error("Update total error:", err);
            res.status(500).json({ error: "Failed to update total" });
          });
        }

        // Get updated total
        const getTotal = `SELECT total_price FROM orders WHERE order_id = ?`;

        db.query(getTotal, [order_id], (err, totalResult) => {
          if (err) {
            return db.rollback(() => {
              console.error("Get total error:", err);
              res.status(500).json({ error: "Failed to get total" });
            });
          }

          // ✅ 7. Commit transaction
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Commit error:", err);
                res.status(500).json({ error: "Failed to commit" });
              });
            }

            const newTotal = totalResult[0]?.total_price || 0;
            console.log(`🎉 SUCCESS! Order total: ${newTotal}`);

            res.json({
              success: true,
              message: "Item added to cart successfully",
              order_id: order_id,
              product_id: product_id,
              quantity_added: qty,
              item_price: price,
              order_total: parseFloat(newTotal)
            });
          });
        });
      });
    }
  });
});


router.get('/cart', verifyToken, (req, res) => {
  const { user_id } = req.user; // ✅ ดึงจาก token ให้ถูก

  const sql = `
    SELECT 
      o.order_id,
      o.total_price,
      o.date AS created_at,
      oi.order_item_id,
      oi.product_id,
      oi.qty,
      oi.price,
      p.name_product,
      p.image,
      (oi.qty * oi.price) AS item_total
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
    WHERE o.user_id = ?
      AND o.status = 'pending'
    ORDER BY oi.order_item_id DESC
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Cart query error:", err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json(results);
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


router.put('/cart_update', verifyToken, (req, res) => {
  const { order_id } = req.body;     // ✔ ดึง order_id ที่ส่งมาจาก frontend
  const { user_id } = req.user;      // ✔ ดึง user_id จาก token

  const updateOrderQuery = `
    UPDATE orders
    SET status = 'paid'
    WHERE order_id = ? AND user_id = ?
  `;

  db.query(updateOrderQuery, [order_id, user_id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({
        error: "Not allowed — this order does not belong to you"
      });
    }

    res.json({ message: "Order status updated to paid" });
  });
});


  



module.exports = router;
