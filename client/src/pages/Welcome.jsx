function Welcome({ setPage }) {
  return (
    <section className="text-center py-10">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400 drop-shadow">
        ยินดีต้อนรับสู่ SIP8+
      </h2>

      

      <button
        onClick={() => setPage("home")}
        className="w-full p-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold rounded-xl"
      >
        เริ่มช้อปปิ้ง
      </button>
    </section>
  );
}

export default Welcome;
