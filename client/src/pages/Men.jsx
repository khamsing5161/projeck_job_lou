import { useEffect, useState } from "react";
import api from "../api/axios";
import image from "../api/image";
import { Link } from 'react-router-dom';
import RecommendedProducts from "../components/RecommendedProducts";

function Men() {

    const [ladies, setladies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/products/man");
                setladies(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);






    return (
        <div className="px-10 py-8 font-sans">


            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-widest">
                    GENTLEMEN'S SHOPS

                </h1>

            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-blue-900/40 mb-10">
                {["Shop All"].map((tab, i) => (
                    <button
                        key={tab}
                        className={`pb-3 text-sm tracking-wide ${i === 0
                                ? "border-b-2 border-blue-500 text-blue-400 font-semibold"
                                : "text-gray-400 hover:text-blue-400"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ladies.map((item) => (
                    <Link to={`/product/${item.product_id}`} key={item.product_id}>
                        <div className="group">

                            {/* Image */}
                            <div className="relative aspect-square bg-[#0a0f1f] rounded-2xl overflow-hidden border border-blue-900/40
                              hover:border-blue-500 transition">

                                {/* SALE */}
                                {Number(item.final_price) < Number(item.original_price) && (
                                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full z-10">
                                        SALE
                                    </span>
                                )}

                                <img
                                    src={`http://localhost:5000${item.image}`}
                                    alt={item.name_product}
                                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition"
                                />

                                {/* ❤️ Favorite */}
                                <button
                                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50
                             opacity-0 group-hover:opacity-100 transition
                             flex items-center justify-center text-blue-400 hover:text-blue-300"
                                >
                                    ❤
                                </button>
                            </div>

                            {/* Info */}
                            <div className="mt-4 space-y-1">
                                {/* Price */}
                                {Number(item.final_price) < Number(item.original_price) ? (
                                    <>
                                        <p className="text-blue-400 font-semibold text-lg">
                                            ฿{Number(item.final_price).toLocaleString()}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <p className="line-through text-gray-500 text-sm">
                                                ฿{Number(item.original_price).toLocaleString()}
                                            </p>

                                            {item.discount_type === "percentage" && (
                                                <span className="text-xs bg-blue-900/40 text-blue-400 px-2 py-1 rounded-full">
                                                    -{item.discount_value}%
                                                </span>
                                            )}

                                            {item.discount_type === "fixed" && (
                                                <span className="text-xs bg-blue-900/40 text-blue-400 px-2 py-1 rounded-full">
                                                    -฿{item.discount_value}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <p className="font-semibold text-lg text-blue-400">
                                        ฿{Number(item.original_price).toLocaleString()}
                                    </p>
                                )}

                                <p className="text-sm font-medium">
                                    {item.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {item.role}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </div>

    );
}

export default Men;
