import { useEffect, useState } from "react";
import api from "../api/axios";
import OrderDetailModal from "../components/OrderDetailModal";
import imageBaseUrl from "../api/image";

function Track() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔁 โหลดข้อมูล
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/track/order_history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error("Load order history error:", err);
    }
  };

  // ⏱ โหลดครั้งแรก + ทุก 10 วินาที
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10" style={{ backgroundColor: "#050a0f",}}>
      <h1 className="text-3xl font-bold text-center text-amber-900 mb-4">
        📦 Order History
      </h1>

      <div className="overflow-x-auto max-w-6xl mx-auto">
        <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-amber-800 text-white">
            <tr className="text-center">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Slip</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  ไม่มีรายการสั่งซื้อ
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <tr
                key={order.order_id}
                onClick={() => setSelectedOrder(order)}
                className="border-b hover:bg-amber-50 cursor-pointer transition"
              >
                <td className="py-3 px-4 font-semibold text-center">
                  #{order.order_id}
                </td>

                <td className="py-3 px-4 text-center">
                  {new Date(order.payment_date).toLocaleString()}
                </td>

                <td className="py-3 px-4 text-right">
                  {Number(order.total_price).toLocaleString()} THB
                </td>

                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "success"
                        ? "bg-green-100 text-green-700"
                        : order.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-center">
                  {order.slip_image ? (
                    <img
                      src={`${imageBaseUrl}${order.slip_image}`}
                      alt="Slip"
                      className="w-14 h-14 object-cover rounded-lg shadow mx-auto"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No slip</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔍 Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default Track;
