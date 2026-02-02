const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// UPLOAD payment slip
router.post("/", upload.single("slip_image"), (req, res) => {
  const { order_id, village, district, province } = req.body;
  const slip_image = req.file ? `/uploads/${req.file.filename}` : null;

  // บันทึก payment
  db.query(
    "INSERT INTO payments SET ?",
    { order_id, slip_image, village, district, province, status: "paid" },
    (err) => {
      if (err) return res.status(500).json(err);

      // อัปเดต order เป็น paid
      db.query(
        "UPDATE orders SET status='paid' WHERE order_id=?",
        [order_id]
      );

      res.json({ message: "✅ Upload slip success, order paid" });
    }
  );
});


module.exports = router;
