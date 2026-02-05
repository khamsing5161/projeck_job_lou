import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Payment() {
  const [orders, setOrders] = useState([]);
  const [contactNumber, setContactNumber] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [transport, setTransport] = useState("Anousith");
  const [slipFile, setSlipFile] = useState(null);

  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    setSlipFile(file);
    setSlip(URL.createObjectURL(file));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!slipFile) {
      alert("กรุณาอัปโหลดสลิป");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("order_id", orders[0].order_id);
    formData.append("contact_number", contactNumber);
    formData.append("village", village);
    formData.append("district", district);
    formData.append("province", province);
    formData.append("transport", transport);
    formData.append("slip_image", slipFile);

    try {
      await api.post("/payments", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ ชำระเงินสำเร็จ");
      navigate("/order-success");

    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.error || "ชำระเงินไม่สำเร็จ");
    }
  };




  return (
    <div className="text-center">
      <h2 className="text-2xl mb-6 text-cyan-400">QR PAYMENT</h2>

      <div className="bg-white p-4 inline-block rounded-xl mb-4">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SIP8"
          alt="QR"
        />
      </div>

      <p className="text-sm text-gray-400 mb-4">
        บจก. เอสไอพี 8 พลัส
      </p>

      {/* Payment */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">🏦 Payment</h2>

        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="เบอร์ติดต่อ"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="text"
            placeholder="หมู่บ้าน"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="text"
            placeholder="อำเภอ"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="text"
            placeholder="จังหวัด"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />

          <select
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="Anousith">Anousith</option>
            <option value="Hung_Arun">Hung Arun</option>
          </select>
          <input
              type="file"
              accept="image/*"
              onChange={handleSlipUpload}
              required
            />



          

          <button
            type="submit"
            className="w-full bg-amber-700 text-white py-2 rounded"
          >
            ✅ Confirm Payment
          </button>
        </form>
      </div>


      <button className="w-full p-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold rounded-xl">
        ยืนยันการโอน
      </button>
    </div>
  );
}

export default Payment;
