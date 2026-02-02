import { useState } from "react";

function Track() {
  const [show, setShow] = useState(false);

  return (
    <section>
      <h2 className="text-2xl mb-6 text-cyan-400">ติดตามสถานะขนส่ง</h2>

      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700">
        <input
          type="text"
          placeholder="ใส่เลข Tracking (เช่น SIP8001)"
          className="w-full p-4 bg-black border border-blue-900 rounded-lg mb-4"
        />

        <button
          onClick={() => setShow(true)}
          className="w-full p-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-black rounded-lg"
        >
          ตรวจสอบ
        </button>

        {show && (
          <div className="mt-6 flex items-center gap-4 text-green-400">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            <p>พัสดุถึงศูนย์กระจายสินค้า (วังเวียง)</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Track;
