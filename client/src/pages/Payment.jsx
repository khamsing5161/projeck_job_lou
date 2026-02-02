function Payment() {
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

      <input type="file" className="w-full mb-6" />

      <button className="w-full p-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold rounded-xl">
        ยืนยันการโอน
      </button>
    </div>
  );
}

export default Payment;
