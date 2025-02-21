import React from "react";
import { cakes } from "../Utils/data";
import SellingCard from "../Components/SellingCard";
import { useNavigate } from "react-router-dom";

function Groceries({ isLoggedIn }) {
  // const isLoggedIn = props.isLoggedIn;

  const navigate = useNavigate();

  console.log("Logged in : " + isLoggedIn);

  return (
    <div className="bg-[#f8f6f3d7] flex mx-auto gap-x-2 justify-evenly w-[90%] h-[88%] flex-wrap">
      {cakes.map((item) => {
        return <SellingCard item={item} isLoggedIn={isLoggedIn} />;
      })}
    </div>
  );
}

export default Groceries;
