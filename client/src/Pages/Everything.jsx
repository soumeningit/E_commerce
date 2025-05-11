import React, { useEffect, useState } from "react";
import { data } from "../Utils/data";
import Footer from "../Components/Footer";
import { getProducts } from "../Service/Operations/ProductOpern";
import ShowProductCard from "../Components/ShowProductCard";

function Everything() {
  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState([]);
  const [sliderValue, setSliderValue] = useState(10);
  const [price, setPrice] = useState([]);
  const [quantity, setQuantity] = useState(0);

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

  function handleAddQuantity() {
    setQuantity((prevQuantity) => prevQuantity + 1);
  }

  function handleReduceQuantity() {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  }

  const getAllProducts = async () => {
    try {
      const response = await getProducts();
      console.log(response);
      console.log("response : " + JSON.stringify(response));
      if (response.status === 200) {
        setItem(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="mx-auto p-4 bg-[rgba(239,237,235,0.78)] rounded-md shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {item.length > 0 &&
          item.map((item, index) => {
            return (
              <ShowProductCard
                key={index}
                image={item.product_image}
                productName={item.product_name}
                shortDescription={item.short_desc}
                productPrice={item.product_mrp}
                productId={item.product_id}
              />
            );
          })}
      </div>

      <Footer />
    </div>
  );
}

export default Everything;
