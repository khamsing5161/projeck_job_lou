import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Payment() {
  const [orders, setOrders] = useState([]);
  const [slip, setSlip] = useState(null);
  const [slipFile, setSlipFile] = useState(null);
  const [summary, setSummary] = useState({
      subtotal_original: 0,
      subtotal_discounted: 0,
      total_discount: 0,
      total_price: 0
    });

  const [contactNumber, setContactNumber] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [transport, setTransport] = useState("Anousith");
  const [orderId, setOrderId] = useState(null);

  const navigate = useNavigate();


  const formatPrice = (n) =>
    new Intl.NumberFormat("en-US").format(n || 0);

  /* ===== Load Order ===== */
  useEffect(() => {
    const fetchOrderSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/payments/order_summary", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.items || []);
        setOrderId(res.data.order_id);
        setSummary(res.data.summary);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrderSummary();
  }, []);

  /* ===== Total ===== */
  const totalAmount = orders.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  /* ===== Upload Slip ===== */
  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlipFile(file);
      setSlip(URL.createObjectURL(file));
    }
  };

  /* ===== Submit ===== */
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!slipFile || !contactNumber || !village || !district || !province) {
      alert("❌ กรุณากรอกข้อมูลให้ครบ");
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
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ ชำระเงินสำเร็จ");
      navigate("/order-success");
    } catch (err) {
      alert("❌ ชำระเงินไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* LEFT */}
        <form onSubmit={handlePaymentSubmit} className="space-y-8">
          <h1 className="text-3xl font-bold text-blue-500">ชำระเงิน</h1>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold mb-2">ข้อมูลติดต่อ</h2>
            <input
              className="w-full bg-gray-900 border border-gray-700 px-4 py-3 focus:border-blue-500 outline-none"
              placeholder="เบอร์โทรศัพท์"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>

          {/* Address */}
          <div>
            <h2 className="text-lg font-semibold mb-2">ที่อยู่</h2>
            <div className="space-y-3">
              <input className="input-dark" placeholder="Village" value={village} onChange={(e) => setVillage(e.target.value)} />
              <input className="input-dark" placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
              <input className="input-dark" placeholder="Province" value={province} onChange={(e) => setProvince(e.target.value)} />
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h2 className="text-lg font-semibold mb-2">การจัดส่ง</h2>
            <select
              className="w-full bg-gray-900 border border-gray-700 px-4 py-3"
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
            >
              <option value="Anousith">Anousith</option>
              <option value="Hung_Arun">Hung Arun</option>
            </select>
          </div>

          {/* Payment */}
          <div>
            <img src="data:image/png;base64,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" className="w-32 h-32 rounded-xl" />
            <h2 className="text-lg font-semibold mb-3">อัปโหลดสลิป</h2>
            <div className="border border-gray-700 p-4">
              <input type="file" accept="image/*" onChange={handleSlipUpload} />
              {slip && (
                <img src={slip} className="mt-4 w-48 rounded border border-gray-700" />
              )}
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 text-lg font-semibold">
            ยืนยันการชำระเงิน
          </button>
        </form>

        {/* RIGHT */}
        <div className="lg:border-l border-gray-800 lg:pl-8">
          <h2 className="text-lg font-semibold mb-6">คำสั่งซื้อของคุณ</h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {orders.map((item) => (
              <div key={item.order_id} className="flex justify-between text-sm">
                <img src={item.image} className="w-32 h-32 rounded-xl" />

                <span>{item.name} × {item.qty}</span>
                <span className="line-through text-gray-400 mr-2">
                  ฿{formatPrice(item.original_price)}
                </span>
                <span className="text-blue-400 font-bold">
                  ฿{formatPrice(item.final_price)}
                </span>{" "}
                x {item.qty}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-gray-800 pt-4">
            <div className="flex justify-between text-lg font-semibold">
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
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Payment;
