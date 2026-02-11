import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function Productid() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false); // สำหรับสถานะเพิ่มตะกร้า

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US").format(price || 0);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/product/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // =============================
  // ADD TO CART
  // =============================
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("กรุณาเข้าสู่ระบบ");

    const priceToSend = item.final_price < item.original_price
      ? item.final_price
      : item.original_price;

    setAdding(true);
    try {
      const res = await api.post(
        "/orders/cart_input",
        {
          product_id: item.product_id,
          qty: 1,
          price: priceToSend
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Added to cart 🛒");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return <p className="text-center text-blue-400 mt-10">Loading...</p>;

  if (!item)
    return <p className="text-center text-red-500 mt-10">Product not found</p>;

  return (
    <section className="bg-[#05070d] text-blue-300 min-h-screen">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[65%_35%]">
        
        {/* IMAGE */}
        <div className="bg-[#0a0f1f] flex items-center justify-center p-16 rounded-lg">
          <img
            src={`http://localhost:5000${item.image}`}
            alt={item.name}
            className="max-h-[600px] object-contain"
          />
        </div>

        {/* INFO */}
        <div className="bg-[#0a0f1f] border-l border-blue-900/40 p-12 flex flex-col rounded-r-lg">
          <p className="text-xs text-blue-600 tracking-widest uppercase mb-8">
            Home / Product
          </p>

          <h1 className="text-2xl tracking-widest uppercase mb-4 font-bold text-blue-400">
            {item.name}
          </h1>

          {/* PRICE ZONE */}
          {item.final_price < item.original_price ? (
            <div className="mb-8">
              <p className="text-3xl font-bold text-blue-400">
                ฿{formatPrice(item.final_price)}
              </p>
              <p className="line-through text-blue-700">
                ฿{formatPrice(item.original_price)}
              </p>

              {item.promo_state === "active" && (
                <span className="inline-block mt-2 text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded">
                  {item.discount_type === "percentage"
                    ? `-${item.discount_value}%`
                    : `-฿${formatPrice(item.discount_value)}`}
                </span>
              )}

              {item.promo_state === "expired" && (
                <span className="inline-block mt-2 text-xs text-blue-600">
                  โปรหมดอายุแล้ว
                </span>
              )}
            </div>
          ) : (
            <p className="text-3xl font-bold mb-8 text-blue-400">
              ฿{formatPrice(item.original_price)}
            </p>
          )}

          <div className="h-px bg-blue-900/50 mb-8"></div>

          <p className="text-sm text-blue-300 leading-relaxed mb-10">
            {item.description || "No description"}
          </p>

          {/* ADD TO cart BUTTON */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`mt-auto w-full py-4 border border-blue-400
              tracking-widest hover:bg-blue-400 hover:text-black transition
              rounded-md
              ${adding ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {adding ? "Adding..." : "ADD TO BAG"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Productid;
