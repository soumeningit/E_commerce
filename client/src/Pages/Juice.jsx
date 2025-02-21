import React from "react";
import { juice } from "../Utils/data";
import SellingCard from "../Components/SellingCard";

function Juice({ isLoggedIn }) {
  return (
    <div className="bg-[#f8f6f3d7] flex mx-auto gap-x-2 justify-evenly w-[90%] h-[88%] flex-wrap">
      {juice.map((item) => {
        return <SellingCard item={item} isLoggedIn={isLoggedIn} />;
      })}
    </div>
  );
}

export default Juice;
