import React from 'react'
import api from "../api/axios";
import { useState, useEffect } from 'react';


function Layoutlubricating_gel() {

      const [lubricating_gel, setlubricating_gel] = useState([]);

      useEffect(() => {
        api.get("/products/lubricating_gel").then(res => setlubricating_gel(res.data));

  }, []);
    
  return (
    <>
    {lubricating_gel.map((item) => (
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

export default Layoutlubricating_gel