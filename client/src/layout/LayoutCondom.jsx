import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import api from "../api/axios";

function LayoutCondom() {
  const [condom, setcondom] = useState([]);

  useEffect(() => {
    api.get("/products/condom").then(res => setcondom(res.data));

  }, []);
  return (
    <>
      {condom.map((item) => (
        <div key={item.product_id} className="bg-white rounded-xl shadow-md p-4 hover:scale-105 transition-transform duration-200">
          <img
            src={`http://localhost:5000${item.image}`}
            alt={item.name_product}
            className="rounded-md mb-3"
          />
          <h3 className="font-semibold">{item.name_product}</h3>
          <p className="text-amber-700">{item.price} THB</p>
        </div>
      ))}
    </>
  )
}

export default LayoutCondom