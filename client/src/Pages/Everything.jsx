import React, { useState } from "react";
import SellingCard from "../Components/SellingCard";
import { data } from "../Utils/data";
import ShowCard from "../Components/ShowCard";
import Footer from "../Components/Footer";

function Everything({ isLoggedIn }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState(null);
  const [sliderValue, setSliderValue] = useState(10);
  const [price, setPrice] = useState([]);

  console.log("price : " + price);

  const sliderHandeler = (event) => {
    console.log(sliderValue);
    setSliderValue(event.target.value);
    const itemPrice = data.filter(
      (item) => item.price >= 10 && item.price <= sliderValue
    );
    console.log(itemPrice);
    setPrice(itemPrice);
  };

  function checkMatch() {
    const matchedItems = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // console.log(matchedItems)
    if (matchedItems.length > 0) {
      // If there are matching items, display them
      setItem(matchedItems[0]);
    } else {
      setItem(null);
      console.log(`No match found for .`);
      console.error(`No match found for .`);
      alert("No match item found");
    }
  }

  return (
    <div className="w-full flex flex-col">
      {/* search by scroolbar */}
      <div className="flex flex-row ">
        <div className="h-24 w-44 flex flex-col">
          <input
            type="range"
            min={10}
            value={sliderValue}
            onChange={sliderHandeler}
          />
          <div className="flex flex-col">
            <p>Minimum Price : {10}</p>
            <p>Maximum Price : {sliderValue}</p>
          </div>
        </div>
        <div className="flex flex-row flex-wrap">
          {price.map((item) => {
            return <SellingCard item={item} isLoggedIn={isLoggedIn} />;
          })}
        </div>
      </div>

      {/* Search by name */}
      <div className="flex mx-auto gap-x-2 ">
        <input
          type="text"
          id="substringInput" // Added id here
          className="border border-slate-400 outline-none focus-none rounded-lg w-96"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="border border-gray-400 px-2 py-1 text-md rounded-md"
          onClick={checkMatch}
        >
          Search
        </button>
      </div>

      <div className="mx-auto p-4 bg-[rgba(239,237,235,0.78)] rounded-md shadow-md">
        {item && <ShowCard item={item} isLoggedIn={isLoggedIn} />}
      </div>
      <div className="flex flex-row flex-wrap w-[88%] mt-8 mx-auto">
        {data.map((item) => (
          <SellingCard key={item.id} item={item} isLoggedIn={isLoggedIn} />
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default Everything;
