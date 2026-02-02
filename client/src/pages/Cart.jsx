function Cart({ setPage }) {
  return (
    <>
      <h2 className="text-2xl mb-6 text-cyan-400">ตะกร้าสินค้า</h2>
      <div className="text-gray-400 mb-6">ตะกร้าว่างเปล่า...</div>
      <button
        onClick={() => setPage("payment")}
        className="w-full p-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold rounded-xl"
      >
        ไปที่หน้าชำระเงิน
      </button>
    </>
  );
}

export default Cart;
