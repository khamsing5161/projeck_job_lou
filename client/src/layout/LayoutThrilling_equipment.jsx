import React from 'react'
import api from "../api/axios";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LayoutThrilling_equipment() {
  const [thrilling_equipment, setthrilling_equipment] = useState([]);

    useEffect(() => {
        api.get("/products/thrilling_equipment").then(res => setthrilling_equipment(res.data));
  }, []);
    
  return (
    <div style={{ height: "800px",}}>
    {thrilling_equipment.map((item) => (
        <Link to={`/product/${item.product_id}`} key={item.product_id}>
          <div className="bg-white rounded-xl shadow-md p-4 hover:scale-105 transition-transform duration-200" style={{ marginTop: "10px",}}>
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.name_product}
              className="rounded-md mb-3"
            />
            <h3 className="font-semibold">{item.name_product}</h3>
            <p className="text-amber-700">{item.price} THB</p>
          </div>
        </Link>
      ))}
      </div>
  )
}

export default LayoutThrilling_equipment