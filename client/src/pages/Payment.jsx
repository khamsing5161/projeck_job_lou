import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Payment() {
  const [orders, setOrders] = useState([]);
  const [slip, setSlip] = useState(null);
  const [slipFile, setSlipFile] = useState(null);

  const [contactNumber, setContactNumber] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [transport, setTransport] = useState("Anousith");
  const [orderId, setOrderId] = useState(null);

  const navigate = useNavigate();

  /* ================= โหลด Order Summary ================= */
  useEffect(() => {
    const fetchOrderSummary = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/payments/order_summary", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.items || []);
        setOrderId(res.data.order_id);
      } catch (err) {
        console.error("Fetch order summary error:", err);
      }
    };

    fetchOrderSummary();
  }, []);

  /* ================= รวมราคา ================= */
  const totalAmount = orders.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  /* ================= อัปโหลดสลิป ================= */
  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlipFile(file);
      setSlip(URL.createObjectURL(file));
    }
  };

  /* ================= Submit Payment ================= */
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!slipFile || !contactNumber || !village || !district || !province || !transport) {
      alert("❌ กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    const formData = new FormData();
    formData.append("order_id", orderId);
    formData.append("contact_number", contactNumber);
    formData.append("village", village);
    formData.append("district", district);
    formData.append("province", province);
    formData.append("transport", transport);
    formData.append("slip_image", slipFile);


    try {
      const token = localStorage.getItem("token");
      await api.post("/payments/success", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
      });

      alert("✅ ชำระเงินสำเร็จ");

      // reset form
      setSlipFile(null);
      setSlip(null);
      setContactNumber("");
      setVillage("");
      setDistrict("");
      setProvince("");
      setTransport("Anousith");

      navigate("/order-success");
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);
      alert(err.response?.data?.error || "❌ ชำระเงินไม่สำเร็จ");
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10" style={{ backgroundColor: "#050a0f",}}>
      <h1 className="text-3xl font-bold text-center text-amber-900 mb-6">
        💳 Payment Confirmation
      </h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">🧾 Order Summary</h2>

          <ul className="divide-y">
            {orders.length === 0 ? (
              <p className="text-gray-400">ไม่มีรายการสั่งซื้อ</p>
            ) : (
              orders.map((item) => (
                <li key={item.product_id} className="flex justify-between py-2">
                  <span>
                    {item.product_name} x {item.qty}
                  </span>
                  <span>{item.item_total} THB</span>
                </li>
              ))
            )}
          </ul>

          <p className="mt-4 text-xl font-bold text-amber-700">
            Total: {totalAmount} THB
          </p>
        </div>

        {/* Payment */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">🏦 Payment</h2>

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <input type="file" accept="image/*" onChange={handleSlipUpload} />

            <input
              type="text"
              placeholder="Contact number"
              className="border p-2 w-full rounded"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />

            <input
              type="text"
              placeholder="Village"
              className="border p-2 w-full rounded"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
            />

            <input
              type="text"
              placeholder="District"
              className="border p-2 w-full rounded"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />

            <input
              type="text"
              placeholder="Province"
              className="border p-2 w-full rounded"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />

            <select
              className="border p-2 w-full rounded"
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
            >
              <option value="Anousith">Anousith</option>
              <option value="Hung_Arun">Hung Arun</option>
            </select>

            {slip && (
              <img src={slip} alt="Slip" className="w-40 mx-auto rounded" />
            )}

            <button
              type="submit"
              className="w-full bg-amber-700 text-white py-2 rounded"

            >
              ✅ Confirm Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payment;
