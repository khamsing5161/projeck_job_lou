const express = require("express");
const cors = require("cors");
const path = require("path");

const registerRoute = require("./routes/register");

require("dotenv").config();

const app = express();
app.use(cors());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
app.use("/api/login", require("./routes/login"));
app.use("/api/register", registerRoute);; // ✅ สำคัญ
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/track", require("./routes/orders_success"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
