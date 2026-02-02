import { useEffect, useState } from "react";
import api from "../api/axios";

function Menu() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, { ...product, qty: 1 }]);
  };

  return (
    <div>
      <h2>☕ Menu</h2>
      {products.map(p => (
        <div key={p.product_id}>
          <h4>{p.name_product}</h4>
          <p>{p.price} ₭</p>
          <button onClick={() => addToCart(p)}>เพิ่ม</button>
        </div>
      ))}
    </div>
  );
}

export default Menu;
