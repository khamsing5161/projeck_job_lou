function Review() {
  return (
    <section>
      <h2 className="text-2xl mb-6 text-cyan-400">รีวิวจากลูกค้า</h2>

      <div className="space-y-4">
        <div className="bg-gray-900 p-4 rounded-xl border-l-4 border-blue-500">
          <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
          <p className="text-sm">
            "ส่งไวมากครับ แพ็คมามิดชิด สินค้าดีจริง" – K. Anousone
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border-l-4 border-blue-500">
          <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
          <p className="text-sm">
            "ຂົນສົ່ງໄວ, ສິນຄ້າດີມີຄຸນນະພາບ!" – K. Somchai
          </p>
        </div>
      </div>
    </section>
  );
}

export default Review;
