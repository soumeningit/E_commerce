import React, { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCategories } from "../Service/Operations/CategoryOpern";
import toast from "react-hot-toast";
import { createProduct } from "../Service/Operations/ProductOpern";

function Products() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  // console.log("User : ", user);
  // console.log(typeof user);

  // const userData = user && JSON.parse(user);

  const [product, setProduct] = useState({
    product_name: "",
    quantity: "",
    description: "",
    product_cost_price: "",
    product_mrp: "",
    category_id: "",
    provider_id: "",
    image: "",
  });

  const [category, setCategory] = useState();

  function handleChange(e) {
    setProduct((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function handleImageChange(e) {
    console.log("Image : ", e.target.files[0]);
    setProduct((prev) => {
      return {
        ...prev,
        image: e.target.files[0],
      };
    });
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories("GET", token);
        // console.log("Categories inside category : ", response);
        setCategory(response?.data?.data);
      } catch (error) {
        console.log("Error in fetching categories : ", error);
      }
    };
    fetchCategories();
  }, []);

  const handleProductAdd = async (e) => {
    e.preventDefault();
    console.log("Product Added");
    console.log("Product : ", product);
    if (product.quantity <= 0) {
      toast.error("Quantity should be greater than 0");
      return;
    }
    if (product.product_cost_price <= 0) {
      toast.error("Cost Price should be greater than 0");
      return;
    }
    if (product.product_mrp <= 0) {
      toast.error("MRP should be greater than 0");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("product_name", product.product_name);
      formData.append("quantity", product.quantity);
      formData.append("description", product.description);
      formData.append("product_cost_price", product.product_cost_price);
      formData.append("product_mrp", product.product_mrp);
      formData.append("category_id", product.category_id);
      formData.append("provider_id", product.provider_id);
      formData.append("image", product.image); // Image file
      formData.append("email", user?.email);

      // console.log("Form Data : ", formData);
      // console.log("Data : ", data);
      await createProduct("POST", formData, token);
    } catch (error) {
      console.log("Error in adding product : ", error);
    }
  };

  // console.log("Categories : ", category);

  return (
    <div className="flex flex-col items-center justify-center p-4 m-4 rounded-lg">
      <h1 className="text-xl font-semibold text-white italic font-serif">
        Products Details
      </h1>
      {/* User Products */}
      <div className="w-3/5 border-1 border-gray-100 m-2 p-2 rounded-md">
        <h2 className="text-lg font-semibold text-white italic font-serif">
          Product 1
        </h2>
        <p className="text-sm text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          accumsan, purus et ultricies luctus, libero turpis luctus elit, nec
          tincidunt justo libero sit amet turpis.
        </p>
      </div>
      {/* Add Product */}
      <div className="w-3/5 border-1 border-gray-100 m-2 p-2 rounded-md">
        <h2 className="text-lg font-semibold text-white italic font-serif">
          Add Product
        </h2>
        <form onSubmit={handleProductAdd} className="w-[85%] p-4 m-4">
          <div className="flex flex-col m-2 space-y-2 text-gray-200">
            <label htmlFor="product_name">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="product_name"
              value={product.product_name}
              onChange={handleChange}
              required
              className="p-2 rounded-md outline-none bg-gray-400 text-gray-950 font-semibold"
            />
          </div>
          <div className="flex flex-col m-2 space-y-2 text-gray-200">
            <label htmlFor="quantity">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              required
              className="p-2 rounded-md outline-none bg-gray-400 text-gray-950 font-semibold"
            />
          </div>
          <div className="flex flex-col m-2 space-y-2 text-gray-200">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="p-2 rounded-md outline-none bg-gray-400 text-gray-950 font-semibold"
            />
          </div>
          <div className="flex flex-col m-2 space-y-2 text-gray-200">
            <label htmlFor="product_image">Product Image</label>
            <input
              type="file"
              name="product_image"
              // value={product.product_image}
              onChange={handleImageChange}
              className="p-2 rounded-md outline-none bg-gray-400 text-gray-950 font-semibold"
            />
          </div>
          <div className="flex flex-col m-2 space-y-2 text-gray-200">
            <label htmlFor="product_cost_price">
              Cost Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="product_cost_price"
              value={product.product_cost_price}
              onChange={handleChange}
              required
              className="p-2 rounded-md outline-none bg-gray-400 text-gray-950 font-semibold"
            />
          </div>
          <div className="flex flex-col m-2 space-y-2 text-gray-200">
            <label htmlFor="product_mrp">
              MRP <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="product_mrp"
              value={product.product_mrp}
              onChange={handleChange}
              required
              className="p-2 rounded-md outline-none bg-gray-400 text-gray-950 font-semibold"
            />
          </div>
          <div className="flex flex-col m-2 space-y-2 text-gray-200">
            <label htmlFor="category_id">Category</label>
            <select
              name="category_id"
              value={product.category_id}
              onChange={handleChange}
              className="p-2 rounded-md outline-none bg-gray-400 text-gray-950 font-semibold"
            >
              <option value="">Select Category</option>
              {category &&
                category.map((data, index) => (
                  <option key={index} value={data.id} className="text-gray-950">
                    {data.categori_name}
                  </option>
                ))}
            </select>
          </div>
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-md font-semibold cursor-pointer ml-2"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default Products;
