import React from "react";
import organicProduct from "../image/organic-products-hero.png";
import { IoCartOutline } from "react-icons/io5";
import leaf from "../image/logo-leaf-new.png";
import { NavLink } from "react-router-dom";

function HomeContent() {
  return (
    <div className="flex justify-between p-4 bg-custom-gradient h-screen ">
      <div className="ml-10 mt-10 w-[50%]">
        <img src={organicProduct} alt="" />
      </div>
      <div className="mt-10 w-[40%] h-full items-start ">
        <img src={leaf} alt="leaf-img" className="ml-8" />
        <div className="flex flex-col items-start justify-center gap-y-7 ml-8">
          <p className="text-md font-semibold">
            Everything You Need, All in One Place
          </p>
          <h1 className="text-4xl font-bold">Discover Smart Shopping Today!</h1>
          <p className="text-md font-semibold mt-16 items-start">
            Explore top deals, trending products, and unbeatable prices across
            electronics, fashion, home essentials, and more. Fast delivery,
            secure payments, and 24/7 customer support — all tailored for you.
          </p>
          <NavLink to="/everything">
            <button className="bg-green-500 flex px-2 py-2 rounded-md text-white hover:bg-green-400 transition-all mt-16 cursor-pointer">
              <IoCartOutline className="m-1" />{" "}
              <span className="">Shop Now</span>
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default HomeContent;
