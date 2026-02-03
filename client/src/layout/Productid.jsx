import React from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

function Productid() {
  const { id } = useParams();
  const [item, setItem] = React.useState(null);
  const [isAdding, setIsAdding] = React.useState(false);

  // โหลดข้อมูลสินค้า
  React.useEffect(() => {
    api.get(`/products/product/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error("Product load error:", err));
  }, [id]);

  // ฟังก์ชันเพิ่มสินค้าในตะกร้า
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("กรุณาเข้าสู่ระบบ");

    setIsAdding(true);
    try {
      const res = await api.post(
        "/orders/cart_input",
        {
          product_id: item.product_id,
          qty: 1,
          price: item.price,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(res.data.message + " 🛒");

    } catch (err) {
      console.error("Add to cart error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Session expired. Please login again");
        localStorage.removeItem("token");
      } else {
        alert("❌ ไม่สามารถเพิ่มสินค้าลงในตะกร้าได้");
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (!item) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section className="flex-1 px-8 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">{item.name_product}</h1>
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 flex gap-6">
        <img
          src={`http://localhost:5000${item.image}`}
          alt={item.name_product}
          className="w-1/2 rounded-lg shadow-sm"
        />
        <div className="w-1/2 flex flex-col gap-4">
          <h3 className="text-2xl font-semibold">{item.name_product}</h3>
          <p className="text-xl text-amber-700">{item.price} THB</p>
          <p className="text-gray-600">{item.description}</p>
          <button
            disabled={isAdding}
            onClick={handleAddToCart}
            className={`bg-amber-700 text-white px-6 py-2 rounded-md mt-4 ${isAdding ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-800'}`}
          >
            {isAdding ? 'กำลังเพิ่ม...' : 'ส่งไปยังตะกร้า 🛒'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Productid;
