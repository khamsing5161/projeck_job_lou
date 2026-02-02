function BottomNav({ setPage }) {
  return (
    <nav className="fixed bottom-0 w-full bg-[#050a0f] border-t border-gray-800 flex justify-around p-3 text-xs">
      <button onClick={() => setPage("home")} className="flex flex-col items-center">
        <span className="text-xl">🏠</span>หน้าหลัก
      </button>
      <button onClick={() => setPage("track")} className="flex flex-col items-center">
        <span className="text-xl">📦</span>ติดตาม
      </button>
      <button onClick={() => setPage("review")} className="flex flex-col items-center">
        <span className="text-xl">⭐</span>รีวิว
      </button>
    </nav>
  );
}

export default BottomNav;
