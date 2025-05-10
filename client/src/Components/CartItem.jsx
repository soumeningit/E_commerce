import React from "react";
import { Trash2 } from "lucide-react"; // Using lucide-react for icons

const CartItem = ({ item, updateQuantity, removeItem }) => {
  if (!item) return null;

  const { product_name, image, quantity, price_per_item, product_id, id } =
    item;

  const handleAdd = () => {
    updateQuantity(id, quantity + 1);
  };

  const handleSubtract = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    }
  };

  return (
    <div className="border p-4 rounded shadow-md flex gap-4 mb-4 items-center">
      <img src={image} alt={product_name} className="w-32 h-32 object-cover" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-semibold">{product_name}</h3>
            <p className="text-xl font-semibold">₹{price_per_item}</p>
            <div className="flex items-center gap-2 mt-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                onClick={handleSubtract}
              >
                -
              </button>
              <span className="font-semibold">{quantity}</span>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
                onClick={handleAdd}
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={() => removeItem(id)}
            className="text-red-600 hover:text-red-800 cursor-pointer"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
