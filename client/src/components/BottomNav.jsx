import { Link } from "react-router-dom";

function BottomNav({ setPage }) {
  return (
    <nav className="fixed bottom-0 w-full bg-[#050a0f] border-t border-gray-800 flex justify-around p-3 text-xs">
      <Link to={"/home"}>
        <button onClick={() => setPage("home")} className="flex flex-col items-center">
          <span className="text-xl">🏠</span><p className="text-white">หน้าหลัก</p>
        </button>
      </Link>

      <Link to={"/track"}>
        <button onClick={() => setPage("track")} className="flex flex-col items-center">
          <span className="text-xl">📦</span><p className="text-white">ติดตาม</p>
        </button>
      </Link>

      <Link to={"/review"}>
        <button onClick={() => setPage("review")} className="flex flex-col items-center">
          <span className="text-xl ">⭐</span><p className="text-white">รีวิว</p>
        </button>
      </Link>


    </nav>
  );
}

export default BottomNav;
