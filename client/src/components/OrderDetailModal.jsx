import React from "react";
import imageBaseUrl from "../api/image";

function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">

        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-amber-800 mb-4">
          🧾 Order #{order.order_id}
        </h2>

        {/* Status */}
        <div className="mb-3">
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold
              ${
                order.status === "success"
                  ? "bg-green-100 text-green-700"
                  : order.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {order.status}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-2 text-gray-700">
          <p><b>Date:</b> {new Date(order.payment_date).toLocaleString()}</p>
          <p><b>Total:</b> {order.total_price.toLocaleString()} THB</p>
          <p><b>Transport:</b> {order.transport}</p>
          <p><b>Contact:</b> {order.contact_number}</p>
          <p><b>Address:</b> {order.village}, {order.district}</p>
        </div>

        {/* Slip */}
        {order.slip_image && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Slip:</p>
            <img
              src={`${imageBaseUrl}${order.slip_image}`}
              alt="Slip"
              className="w-full rounded-lg border"
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default OrderDetailModal;
