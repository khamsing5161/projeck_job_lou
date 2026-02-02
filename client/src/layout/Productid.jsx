import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import { Link } from 'react-router-dom';



function Productid() {
  const { id } = useParams();
  const [item, setItem] = React.useState(null);
  const [isAdding, setIsAdding] = React.useState(false);

  React.useEffect(() => {
    api.get(`/products/product/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error("Product load error:", err));
  }, [id]);

  

  if (!item) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <>

      <section className="flex-1 px-8 py-10">
        <h1 className="text-3xl font-bold text-center text-amber-900 mb-8">
          {item.name}
        </h1>

        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
          <div className="flex gap-6 items-start">
            
            {/* image */}
            <div className="w-1/2">
              <img
                src={`http://localhost:5000${item.image}`}
                alt={item.name}
                className="rounded-lg shadow-sm"
              />
            </div>

            {/* detail */}
            <div className="w-1/2 flex flex-col gap-4">
              <h3 className="font-semibold text-2xl">{item.name}</h3>
              <p className="text-amber-700 text-xl">{item.price} THB</p>
              <p className="text-gray-600 text-sm">{item.description}</p>

              <button
                disabled={isAdding}
                className={`bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md font-semibold mt-4 ${
                  isAdding ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isAdding ? 'กำลังเพิ่ม...' : 'ส่งไปยังตะกร้า'} 🛒
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Productid;
