import React, { useEffect, useState } from "react";
import api from "../api/axios";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบ");
      return;
    }

    try {
      const res = await api.get("/orders/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(res.data);
    } catch (err) {
      console.error("Load cart error:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
        localStorage.removeItem("token");
      } else {
        alert("ไม่สามารถโหลดตะกร้าได้");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">กำลังโหลดตะกร้า...</p>;
  }

  if (cart.length === 0) {
    return <p className="text-center mt-10 text-gray-400">🛒 ตะกร้าว่างเปล่า</p>;
  }

  const orderTotal = cart[0]?.total_price || 0;

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-cyan-500">ตะกร้าสินค้า</h2>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.order_item_id}
            className="flex items-center gap-4 bg-white shadow rounded-xl p-4"
          >
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.name_product}
              className="w-24 h-24 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {item.name_product}
              </h3>
              <p className="text-gray-500">
                ราคา {item.price} x {item.qty}
              </p>
            </div>

            <div className="font-bold text-amber-700">
              {item.item_total} THB
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-8 flex justify-between items-center bg-gray-100 p-4 rounded-xl">
        <span className="text-xl font-semibold">รวมทั้งหมด</span>
        <span className="text-2xl font-bold text-emerald-600">
          {orderTotal} THB
        </span>
      </div>

      {/* Checkout */}
      <button
        className="w-full mt-6 p-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold rounded-xl hover:opacity-90"
        onClick={() => alert("ไปหน้า Checkout ต่อได้เลย 🚀")}
      >
        ดำเนินการชำระเงิน
      </button>
    </section>
  );
}

export default Cart;
