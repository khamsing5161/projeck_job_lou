import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState({
    subtotal_original: 0,
    subtotal_discounted: 0,
    total_discount: 0,
    total_price: 0
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(false);
  
  

  const navigate = useNavigate();

  const formatPrice = (n) =>
    new Intl.NumberFormat("en-US").format(n || 0);

  // โหลดตะกร้า
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/orders/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.items);
      setSummary(res.data.summary);
    } catch (err) {
      alert("โหลดตะกร้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // อัปเดตจำนวน
  const updateQty = async (order_item_id, qty) => {
    if (qty < 1) return;
    const token = localStorage.getItem("token");
    setUpdating(order_item_id);
    try {
      await api.put(
        "/orders/cart/update_qty",
        { order_item_id, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } finally {
      setUpdating(null);
    }
  };

  // ลบสินค้า
  const removeItem = async (order_item_id) => {
    if (!window.confirm("ลบสินค้านี้?")) return;
    const token = localStorage.getItem("token");
    setUpdating(order_item_id);
    try {
      await api.delete(`/orders/cart/remove_item/${order_item_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } finally {
      setUpdating(null);
    }
  };

  // Checkout
  // const handleCheckout = async () => {
  //   const token = localStorage.getItem("token");
  //   setUpdatingOrder(true);
  //   try {
  //     await api.put(
  //       "/orders/cart_update",
  //       {},
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     navigate("/payment");
  //   } finally {
  //     setUpdatingOrder(false);
  //   }
  // };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p className="text-center mt-10">กำลังโหลด...</p>;
  if (!cart.length) return <p className="text-center mt-10">🛒 ตะกร้าว่าง</p>;

  return (
    <div className="min-h-screen bg-[#05070d] text-gray-100 p-10 flex gap-16">

      {/* ITEMS */}
      <div className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold text-blue-300">
          ตะกร้า ({cart.length})
        </h1>

        {cart.map(item => (
          <div key={item.order_item_id} className="flex gap-6 border-b pb-6">
            <img src={item.image} className="w-32 h-32 rounded-xl" />

            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {item.name_product}
              </h3>

              <p className="mt-1">
                <span className="line-through text-gray-400 mr-2">
                  ฿{formatPrice(item.original_price)}
                </span>
                <span className="text-blue-400 font-bold">
                  ฿{formatPrice(item.final_price)}
                </span>{" "}
                x {item.qty}
              </p>

              {item.discount_per_item > 0 && (
                <p className="text-sm text-red-400">
                  ลด {formatPrice(item.discount_per_item)} บาท / ชิ้น
                </p>
              )}

              <div className="flex gap-4 mt-4">
                <button onClick={() => updateQty(item.order_item_id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.order_item_id, item.qty + 1)}>+</button>
                <button onClick={() => removeItem(item.order_item_id)} className="text-red-400">
                  ลบ
                </button>
              </div>
            </div>

            <div className="font-bold text-lg">
              ฿{formatPrice(item.line_final_total)}
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="w-[380px] bg-[#0a0f1f] p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">สรุป</h2>

        <div className="flex justify-between">
          <span>ก่อนลด</span>
          <span>฿{formatPrice(summary.subtotal_original)}</span>
        </div>

        <div className="flex justify-between text-red-400">
          <span>ส่วนลด</span>
          <span>-฿{formatPrice(summary.total_discount)}</span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between font-bold text-xl">
          <span>ยอดสุทธิ</span>
          <span className="text-blue-400">
            ฿{formatPrice(summary.total_price)}
          </span>
        </div>
        <Link to="/payment" className="block w-full mt-6">
          <button
            className="w-full py-4 bg-blue-500 text-black rounded-xl font-bold"
          >
            ชำระเงิน
        </button>
        </Link>
      </div>
    </div>
  );
}

export default Cart;
