import React, { useEffect, useState } from "react";
import {
  findItemsByCategory,
  getCategoriesAPI,
} from "../Service/Operations/CategoryOpern";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProducts } from "../Redux/Slice/ProductSlice";

function ItemsByCategory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [categories, setCategories] = useState();
  const [items, setItems] = useState();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getCategoriesAPI("GET");
        if (response.status === 200) {
          setCategories(response.data.data);
          itemsByCategory(response.data.data[0].id);
        }
      } catch (error) {
        console.log("Error in ItemsByCategory : ", error);
      }
    }
    fetchCategories();
  }, []);

  async function itemsByCategory(id) {
    try {
      const response = await findItemsByCategory("GET", id);
      setItems(response.data.data);
    } catch (error) {
      console.log("Error in ItemsByCategory : ", error);
    }
  }

  function handleCardClick(id, name) {
    const data = items.find((item) => item.product_id === id);

    dispatch(setProducts(data));
    // navigate(`/product/${id}`);
    const productData = new Array();
    productData.push(data);
    navigate(`/${name}/product-details/${id}`, {
      state: { productDetails: productData },
    });
  }

  return (
    <div className="flex flex-col justify-center mx-auto bg-[#f8f6f3d7] my-10 p-4 w-[90%] rounded-md">
      <h1 className="text-xl font-bold font-serif italic text-center">
        Items By Category
      </h1>
      <div className="flex flex-row gap-x-2 flex-wrap items-start m-4 p-2">
        {categories &&
          categories.map((category, index) => {
            return (
              <div
                key={index}
                onClick={() => itemsByCategory(category.id)}
                className="bg-gray-200 border border-gray-400 rounded-full px-2 py-1 my-2 cursor-pointer"
              >
                <p className="text-base rounded-full">
                  {category.category_name}
                </p>
              </div>
            );
          })}
      </div>
      <div className="flex flex-row gap-x-2 flex-wrap items-start m-4 p-2">
        {items &&
          items.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() =>
                  handleCardClick(item.product_id, item.product_name)
                }
                className="flex flex-col bg-gray-100 p-2 m-2 rounded-md cursor-pointer space-y-2"
              >
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <p className="text-sm font-bold max-w-[10rem]">
                  {item.product_name}
                </p>
                <p className="text-sm font-bold">
                  <span className="mr-1">₹</span>
                  {item.product_mrp}
                </p>
                <button className="px-2 py-1 bg-gray-200 rounded-full text-base cursor-pointer hover:bg-gray-400 font-serif">
                  View Product
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ItemsByCategory;
