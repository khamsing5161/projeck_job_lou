const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const verifyToken = require("../auth/verifyToken");


require("dotenv").config();





router.get('/order_history', verifyToken, (req, res) => {
    const { user_id } = req.user;

    const query = `
    SELECT
        p.payment_id,
        p.order_id,
        p.created_at AS payment_date,
        p.status,
        p.slip_image,
        p.transport,
        p.contact_number,
        p.village,
        p.district,
        o.total_price
        FROM payments AS p
        JOIN orders AS o ON p.order_id = o.order_id
        WHERE o.user_id = ?
        ORDER BY p.created_at DESC
        LIMIT 1000;
  `;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }

        res.json(results);
    });
});


module.exports = router;
