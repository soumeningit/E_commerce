import React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { findItemsByCategoryName } from "../Service/Operations/CategoryOpern";
import ShowProductCard from "../Components/ShowProductCard";
function Electronic() {
  const [data, setData] = useState([]);

  async function getData() {
    try {
      const response = await findItemsByCategoryName("GET", "Electronics");
      console.log("Response: ", response);
      console.log("Response: ", JSON.stringify(response));
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching data: ", error);
      toast.error("Try again later");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bg-[#f8f6f3d7] flex mx-auto gap-x-2 justify-evenly w-[90%] h-[88%] flex-wrap">
      {data.length > 0 &&
        data.map((item, index) => {
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
  );
}

export default Electronic;
