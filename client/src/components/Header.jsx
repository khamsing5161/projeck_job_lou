import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpenproduct, setMenuOpenproduct] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // ===== CART REAL-TIME =====
  const getCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  };

  // ===== INIT =====
  useEffect(() => {
    // cart
    getCartCount();
    window.addEventListener("cartUpdated", getCartCount);

    // dark mode
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }

    return () => {
      window.removeEventListener("cartUpdated", getCartCount);
    };
  }, []);

  // ===== TOGGLE DARK MODE =====
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-white dark:bg-gray-900 dark:text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-serif tracking-wide
                     text-cyan-600 dark:text-cyan-400"
        >
          SIP8+
        </Link>

        {/* Menu */}
        <nav className="hidden md:flex gap-8 text-sm tracking-widest
                        text-gray-700 dark:text-gray-200">
          <Link className="hover:text-cyan-500" to="/sale">SALE</Link>
          <Link className="hover:text-cyan-500" to="/ladies">LADIES</Link>
          <Link className="hover:text-cyan-500" to="/men">GENTLEMEN</Link>
          <p className="hover:text-cyan-500" onClick={() => setMenuOpenproduct(!menuOpenproduct)}>PRODUCTS</p>

        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-5 text-xl
                        text-gray-700 dark:text-gray-200">

          <button className="hover:text-cyan-500">👤</button>
          <button className="hover:text-cyan-500">🔍</button>

          <Link to="/cart" className="relative hover:text-cyan-500">
            🛒
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2
                           bg-cyan-500 text-white
                           text-xs w-5 h-5 rounded-full
                           flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
          </Link>
          {/* Mobile button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>



      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700">
          <nav className="flex flex-col p-4 space-y-4">
            <Link className="hover:text-cyan-500" to="/sale">SALE</Link>
            <Link className="hover:text-cyan-500" to="/ladies">LADIES</Link>
            <Link className="hover:text-cyan-500" to="/men">GENTLEMEN</Link>

            <Link className="hover:text-cyan-500" to="/condom">Condom</Link>
            <Link className="hover:text-cyan-500" to="/lubricating_gel">lubricating gel</Link>
            <Link className="hover:text-cyan-500" to="/strength_medicine">Strength Medicine</Link>
            <Link className="hover:text-cyan-500" to="/thrilling_equipment">Thrilling Equipment</Link>
          </nav>
        </div>
      )}


      {menuOpenproduct && (
        <div className="pl-4 space-y-2 text-sm">
          <Link className="block hover:text-cyan-500" to="/condom">Condom</Link>
          <Link className="block hover:text-cyan-500" to="/lubricating_gel">Lubricating Gel</Link>
          <Link className="block hover:text-cyan-500" to="/strength_medicine">Strength Medicine</Link>
          <Link className="block hover:text-cyan-500" to="/thrilling_equipment">Thrilling Equipment</Link>
        </div>
      )}
    </header>
  );
}
