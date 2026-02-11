import React from 'react'
import api from "../api/axios";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function Layoutstrength_medicine() {
  const [strength_medicine, setstrength_medicine] = useState([]);

  useEffect(() => {
    api.get("/products/strength_medicine").then(res => setstrength_medicine(res.data));

  }, []);

  return (
    <div className="px-10 py-8 font-sans">


      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-widest">
          Strength Medicine'S SHOPS

        </h1>

      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b mb-10">
        {["Shop All"].map((tab, i) => (
          <button
            key={tab}
            className={`pb-3 text-sm ${i === 0
              ? "border-b-2 border-black font-semibold"
              : "text-gray-600"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {strength_medicine.map((item) => (
          <Link to={`/product/${item.product_id}`} key={item.product_id}>
            <div className="group">

              {/* Product Image Container */}
              <div className="bg-gray-100 aspect-square flex items-center justify-center relative group rounded-xl overflow-hidden">

                {/* SALE Badge */}
                {Number(item.final_price) < Number(item.original_price) && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    SALE
                  </span>
                )}

                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name_product}
                  className="w-full h-full object-contain p-6"
                />

                {/* ❤️ Button on hover */}
                <button className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                  ❤️
                </button>
              </div>

              {/* Product Info */}
              <div className="mt-3">
                {/* Price */}
                {Number(item.final_price) < Number(item.original_price) ? (
                  <>
                    <p className="text-red-600 font-bold text-lg">
                      ฿{Number(item.final_price).toLocaleString()}
                    </p>

                    <div className="flex items-center gap-2">
                      <p className="line-through text-gray-400 text-sm">
                        ฿{Number(item.original_price).toLocaleString()}
                      </p>

                      {item.discount_type === "percentage" && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          -{item.discount_value}%
                        </span>
                      )}

                      {item.discount_type === "fixed" && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          -฿{item.discount_value}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="font-bold text-lg">
                    ฿{Number(item.original_price).toLocaleString()}
                  </p>
                )}

                <p className="text-sm mt-1">{item.name}</p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Layoutstrength_medicine