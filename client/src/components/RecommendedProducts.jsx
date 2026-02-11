import React from "react";

export default function RecommendedProducts() {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* LEFT */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-8 text-blue-500">
                ชำระเงิน
              </h1>

              {/* Contact */}
              <div className="mb-10">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  ข้อมูลติดต่อ
                </h2>
                <input
                  type="text"
                  placeholder="Contact number"
                  className="border p-2 w-full rounded"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>

              {/* Address */}
              <div className="mb-10">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  ที่อยู่
                </h2>
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
              </div>

              {/* Shipping */}
              <div className="mb-10">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  ตัวเลือกการจัดส่ง
                </h2>
                <div className="border border-gray-700 p-4 flex justify-between">
                  <select
                    className="border p-2 w-full rounded"
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                  >
                    <option value="Anousith">Anousith</option>
                    <option value="Hung_Arun">Hung Arun</option>
                  </select>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  วิธีชำระเงิน
                </h2>

                <div className="border border-gray-700 p-4 mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="payment" defaultChecked />
                    <span>โอนผ่านธนาคาร / QR Code</span>
                    <input type="file" accept="image/*" onChange={handleSlipUpload} />
                    ฃ{slip && (
                      <img src={slip} alt="Slip" className="w-40 mx-auto rounded" />
                    )}
                  </label>
                </div>

                <button
                  className="w-full bg-blue-600 hover:bg-blue-500
                         py-4 text-lg font-semibold transition"
                >
                  ชำระเงิน
                </button>
              </div>
            </div>
          </form>

                {/* RIGHT */}
                <div className="lg:border-l border-gray-800 lg:pl-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-200">
                            คำสั่งซื้อของคุณ
                        </h2>
                        <button className="text-sm text-blue-400 hover:underline">
                            แก้ไข
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="space-y-3 text-sm mb-6">
                        <div className="flex justify-between">
                            <span>1 ชิ้น</span>
                            <span>฿5,800.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>การจัดส่ง</span>
                            <span className="text-blue-400">ฟรี</span>
                        </div>

                        <div className="flex justify-between font-semibold text-base border-t border-gray-800 pt-3">
                            <span>รวม</span>
                            <span className="text-blue-500">฿5,800.00</span>
                        </div>

                        <p className="text-xs text-gray-400">
                            (รวมภาษี ฿379.44)
                        </p>
                    </div>

                    {/* Discount */}
                    <button className="flex items-center gap-2 text-sm text-blue-400 hover:underline mb-8">
                        🏷️ ใช้โค้ดส่วนลด
                    </button>

                    {/* Product */}
                    <div className="flex gap-4 bg-gray-900 p-4 border border-gray-800">
                        <img
                            src="https://assets.adidas.com/images/w_600,f_auto,q_auto/8d5d9b8c9c0d4b6a9a5baf18009d9b1f_9366/Adizero_EVO_SL_Shoes_Beige.jpg"
                            alt="product"
                            className="w-24 h-24 object-cover"
                        />
                        <div className="text-sm">
                            <p className="font-semibold">
                                รองเท้า Adizero EVO SL
                            </p>
                            <p className="text-blue-400">฿5,800</p>
                            <p className="text-gray-400">
                                ขนาด: 9.5 UK / จำนวน: 1
                            </p>
                            <p className="text-gray-400">
                                สี: Aurora Coffee / Putty Beige / Beige
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
