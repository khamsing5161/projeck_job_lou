
import { Link } from "react-router-dom";



function Home() {
    const categories = [
        { icon: "💎", name: "ถุงยาง" },
        { icon: "⚡", name: "อุปกรณ์เสียว" },
        { icon: "💊", name: "ยาเสริมกำลัง" },
        { icon: "💧", name: "เจลหล่อลื่น" },
    ];

    return (
        <section style={{height: "700px", marginTop: "70px"}} className="max-w-2xl mx-auto py-10 px-4">
            <h2 className="text-xl mb-6 text-cyan-400 drop-shadow">
                หมวดหมู่พรีเมียม
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <Link to="/condom">
                <div

                    className="p-6 border border-cyan-400 rounded-xl bg-gray-900 text-center cursor-pointer hover:scale-105 transition"
                >
                    <div className="text-2xl mb-2">💎</div>
                    <p className="text-white">ถุงยาง</p>
                </div>
                </Link>

                <Link to="/thrilling_equipment">
                <div

                    className="p-6 border border-cyan-400 rounded-xl bg-gray-900 text-center cursor-pointer hover:scale-105 transition"
                >
                    <div className="text-2xl mb-2">⚡</div>
                    <p className="text-white">อุปกรณ์เสียว</p>
                </div>
                </Link>
                <Link to="/strength_medicine">
                <div

                    className="p-6 border border-cyan-400 rounded-xl bg-gray-900 text-center cursor-pointer hover:scale-105 transition"
                >
                    <div className="text-2xl mb-2">💊</div>
                    <p className="text-white">ยาเสริมกำลัง</p>
                </div>
                </Link>
                <Link to="/lubricating_gel">
                <div

                    className="p-6 border border-cyan-400 rounded-xl bg-gray-900 text-center cursor-pointer hover:scale-105 transition"
                >
                    <div className="text-2xl mb-2">💧</div>
                    <p className="text-white">เจลหล่อลื่น</p>
                </div>
                </Link>
            </div>

        </section>
    );
}

export default Home;
