import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // ✅ เพิ่ม
  const [UpdateOrder, setUpdateOrder] = useState(false);




  const navigate = useNavigate();
  // ✅ format ราคา
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US").format(price);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบ");
      return;
    }

    try {
      const res = await api.get("/orders/cart", {
        headers: { Authorization: `Bearer ${token}` },
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
  const updateQty = async (order_item_id, newQty) => {
    if (newQty < 1) return;

    const token = localStorage.getItem("token");
    setUpdating(order_item_id);

    try {
      await api.put(
        "/orders/cart/update_qty",
        {
          order_item_id,
          qty: newQty,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // โหลดตะกร้าใหม่
      fetchCart();
    } catch (err) {
      console.error("Update qty error:", err);
      alert("ไม่สามารถอัปเดตจำนวนสินค้าได้");
    } finally {
      setUpdating(null);
    }
  };

  // ---------------------------
  // ไปหน้า Checkout
  // ---------------------------
  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    const order_id = cart[0]?.order_id;

    if (!order_id) {
      alert("ไม่พบคำสั่งซื้อ");
      return;
    }

    try {
      setUpdateOrder(true);

      await api.put(
        "/orders/cart_update",
        { order_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/payment");
    } catch (err) {
      console.error("payment error:", err);
      alert(err.response?.data?.error || "ไม่สามารถไปหน้าชำระเงินได้");
    } finally {
      setUpdateOrder(false);
    }
  };


  // ---------------------------
  // ลบสินค้าออกจากตะกร้า
  // ---------------------------
  const removeItem = async (order_item_id) => {
    if (!window.confirm("ลบสินค้านี้ออกจากตะกร้าใช่ไหม?")) return;

    const token = localStorage.getItem("token");
    setUpdating(order_item_id);

    try {
      await api.delete(
        `/orders/cart/remove_item/${order_item_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // โหลดตะกร้าใหม่จาก backend
      fetchCart();
    } catch (err) {
      console.error("Remove item error:", err);
      alert("ไม่สามารถลบสินค้าได้");
    } finally {
      setUpdating(null);
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
              <h3 className="font-semibold text-lg">{item.name_product}</h3>
              <p className="text-gray-500">
                ราคา {formatPrice(item.price)} x {item.qty}
              </p>
            </div>

            {/* Qty Control (UI Ready) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.order_item_id, item.qty - 1)}
                disabled={updating === item.order_item_id}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full font-bold disabled:opacity-50"
              >
                −
              </button>

              <span className="w-10 text-center font-semibold">
                {item.qty}
              </span>

              <button
                onClick={() => updateQty(item.order_item_id, item.qty + 1)}
                disabled={updating === item.order_item_id}
                className="bg-amber-700 hover:bg-amber-800 text-white w-8 h-8 rounded-full font-bold disabled:opacity-50"
              >
                +
              </button>
            </div>


            {/* Item Total */}
            <div className="text-right min-w-[120px]">
              <p className="text-lg font-bold text-amber-900">
                {formatPrice(item.item_total)} THB
              </p>
            </div>
            {/* Remove Button */}
            <button
              onClick={() => removeItem(item.order_item_id)}
              disabled={updating === item.order_item_id}
              className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
            >
              ✕
            </button>

          </div>


        ))}
      </div>

      {/* Order Total */}
      <div className="mt-8 flex justify-between items-center bg-gray-100 p-4 rounded-xl">
        <span className="text-xl font-semibold">รวมทั้งหมด</span>
        <span className="text-2xl font-bold text-emerald-600">
          {formatPrice(orderTotal)} THB
        </span>
      </div>

      <button
        className="w-full mt-6 p-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold rounded-xl hover:opacity-90"
        onClick={handleCheckout}
      >
        ดำเนินการชำระเงิน
      </button>
    </section >
  );
}

export default Cart;
