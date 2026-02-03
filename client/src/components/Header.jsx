import { Link } from "react-router-dom";

function Header({ setPage }) {
  return (
    <header className="p-4 flex justify-between items-center sticky top-0 bg-[#050a0f] border-b border-gray-800 z-50">
      <h1
        className="text-2xl font-bold text-cyan-400 cursor-pointer drop-shadow-[0_0_8px_#00f2ff]"
        onClick={() => setPage("home")}
      >
        SIP8+
      </h1>

      <Link to="/cart">
      <div className="relative cursor-pointer" onClick={() => setPage("cart")}>
        🛒
        <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] px-1.5 rounded-full">
          0
        </span>
      </div></Link>
    </header>
  );
}

export default Header;
