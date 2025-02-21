import React from "react";
import SellingCard from "./SellingCard";
import leaf from "../image/logo-leaf-new.png";

const groceryItems = [
  {
    id: 10,
    name: "Assorted Coffee",
    price: 35.0,
    url: "https://www.bouiinternational.org/wp-content/uploads/2018/06/coffee-asorted.jpg",
  },
  {
    id: 11,
    name: "Soaps",
    price: 15.0,
    url: "https://vediherbals.com/cdn/shop/files/1_8f3babf8-52c6-4cff-9373-c2b12f0ae44f.jpg?v=1693809595",
  },
  {
    id: 12,
    name: "Handpicked Red Chillies",
    price: 19.0,
    url: "https://pramoda.co.in/wp-content/uploads/2018/12/Fresh-red-chilli.jpg",
  },
  {
    id: 13,
    name: "Natural Extracted Edible Oil",
    price: 34.0,
    salePrice: 25.0,
    url: "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/65250b1d7da47a26aaabcb0e/new-bottles-with-vectors-01.png",
  },
];

function SellingItem() {
  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <div className="flex mx-auto flex-col object-cover gap-y-8">
        <h1 className="font-bold text-xl">Best Selling Products</h1>
        <img
          src={leaf}
          alt="leaf-img"
          className="w-12 mx-auto items-center mb-8"
        />
      </div>
      <div className="bg-[#f8f6f3d7] flex mx-auto gap-x-2 justify-evenly w-[90%] h-[88%]">
        {groceryItems.map((item) => {
          return <SellingCard item={item} />;
        })}
      </div>
    </div>
  );
}

export default SellingItem;
