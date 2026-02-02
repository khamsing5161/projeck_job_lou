import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import api from "../api/axios";
import { Link } from 'react-router-dom';

function LayoutCondom() {
  const [condom, setcondom] = useState([]);

  useEffect(() => {
    api.get("/products/condom").then(res => setcondom(res.data));

  }, []);
  return (
    <>
      {condom.map((item) => (

        <Link to={`/product/${item.product_id}`} key={item.product_id}>
          <div className="bg-white rounded-xl shadow-md p-4 hover:scale-105 transition-transform duration-200">
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
    </>
  )
}

export default LayoutCondom