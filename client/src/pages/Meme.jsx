import { useState } from "react";

const initialCart = [
  {
    id: 1,
    name: "Nike Air Force 1 '07",
    price: 4200,
    size: "US 9",
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b1e59",
  },
];

export default function Meme() {
  const [cart, setCart] = useState(initialCart);

  const increaseQty = (id) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  const decreaseQty = (id) => {
    setCart(cart.map(item =>
      item.id === id && item.qty > 1
        ? { ...item, qty: item.qty - 1 }
        : item
    ));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="min-h-screen bg-[#05070d] text-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:flex lg:gap-16">

        {/* CART ITEMS */}
        <div className="flex-1 space-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold">
            ตะกร้า ({cart.length})
          </h1>

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border-b border-blue-900/40 pb-6"
            >
              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 rounded-xl object-cover bg-[#0b1020]"
              />

              {/* INFO */}
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-blue-300 mt-1">
                  Size: {item.size}
                </p>

                {/* QTY */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-8 h-8 rounded-full border border-blue-700 text-blue-400 hover:bg-blue-900/40"
                  >
                    −
                  </button>

                  <span className="text-blue-200">{item.qty}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-8 h-8 rounded-full border border-blue-700 text-blue-400 hover:bg-blue-900/40"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-sm text-gray-500 hover:text-red-500"
                  >
                    ลบ
                  </button>
                </div>
              </div>

              {/* PRICE */}
              <div className="font-medium text-blue-300">
                ฿{(item.price * item.qty).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="mt-10 lg:mt-0 lg:w-[380px]">
          <div className="lg:sticky lg:top-24 bg-[#0a0f1f] rounded-2xl p-6 border border-blue-900/40">
            <h2 className="text-xl font-semibold mb-6">
              สรุป
            </h2>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>ยอดรวมย่อย</span>
                <span className="text-blue-300">
                  ฿{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>ค่าจัดส่ง</span>
                <span className="text-blue-400">ฟรี</span>
              </div>
            </div>

            <hr className="my-6 border-blue-900/40" />

            <div className="flex justify-between font-semibold mb-6">
              <span>ยอดรวม</span>
              <span className="text-blue-400">
                ฿{subtotal.toLocaleString()}
              </span>
            </div>

            <button className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition">
              ดำเนินการชำระเงิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
