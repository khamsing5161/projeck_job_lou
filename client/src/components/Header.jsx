import { Link } from "react-router-dom";
import api from "../api/axios";
import { useState, useEffect } from "react";

function Header({ setPage }) {
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setTotalOrders(0);
        return;
      }

      try {
        const res = await api.get("/orders/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // สมมติว่า res.data เป็น array ของ order items
        setTotalOrders(res.data.length);
      } catch (err) {
        console.error("Load cart count error:", err);
        setTotalOrders(0);
      }
    };

    // โหลดครั้งแรก
    fetchCartCount();

    // ตั้ง interval ให้โหลดข้อมูลใหม่ทุก 10 วินาที
    const interval = setInterval(fetchCartCount, 10000);

    return () => clearInterval(interval); // เคลียร์ interval เมื่อ component unmount
  }, []);

  return (
    <header className="p-4 flex justify-between items-center sticky top-0 bg-[#050a0f] border-b border-gray-800 z-50">
      <Link to="/home">
        <h1
          className="text-2xl font-bold text-cyan-400 cursor-pointer drop-shadow-[0_0_8px_#00f2ff]"
          onClick={() => setPage("home")}
        >
          SIP8+
        </h1>
      </Link>

      <Link to="/cart">
        <div className="relative cursor-pointer" onClick={() => setPage("cart")}>
          🛒
          <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] px-1.5 rounded-full">
            {totalOrders > 99 ? "99+" : totalOrders}
          </span>
        </div>
      </Link>
    </header>
  );
}

export default Header;
