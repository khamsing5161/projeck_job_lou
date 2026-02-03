const express = require("express");
const router = express.Router();
const db = require("../db"); // MySQL connection
const bcrypt = require("bcryptjs");

// POST /api/register
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  // ตรวจสอบข้อมูล
  if (!name || !email || !password) {
    return res.status(400).json({ error: "กรอกข้อมูลไม่ครบ" });
  }

  try {
    // ตรวจสอบ email ซ้ำ
    const [rows] = await db.promise().query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.status(400).json({ error: "Email ถูกใช้งานแล้ว" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึก user ใหม่
    const result = await db.promise().query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.json({ message: "สมัครสมาชิกสำเร็จ", user_id: result[0].insertId });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});

module.exports = router;