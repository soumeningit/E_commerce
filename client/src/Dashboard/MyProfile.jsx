import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProductDetails } from "../Service/Operations/UserOpern";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);

  if (!user) {
    navigate("/login");
    return null;
  }
  // let userData = JSON.parse(user);
  // console.log("USER DATA : ", userData);

  // console.log("USER : ", user + typeof user);

  if (!token) {
    navigate("/login");
    return null;
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getProductDetails("GET", { id: user.id }, token);
        console.log("PRODUCT DETAILS : ", response);
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (e) {
        console.log("PRODUCT DETAILS ERROR : ", e);
      }
    }
    fetchProducts();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Show 3 more products each time
  };

  const handleProductClick = (id) => {
    console.log("Product Clicked : ");
    console.log("Product ID : ", id);
  };

  return (
    // <div className="bg-gray-900 text-white flex flex-col items-center py-10">
    //   <h1 className="text-3xl font-semibold mb-6">Your Listed Products</h1>
    //   <div className="w-4/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {products.length > 0 ? (
    //       products.map((product) => (
    //         <div
    //           key={product.product_id}
    //           onClick={() => handleProductClick(product.product_id)}
    //           className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center cursor-pointer"
    //         >
    //           <img
    //             src={product.product_image}
    //             alt="product"
    //             className="w-full h-48 object-cover rounded-md"
    //           />
    //           <h3 className="text-xl font-bold mt-4">{product.product_name}</h3>
    //           <p className="text-gray-300 text-sm mt-2">
    //             {product.product_description}
    //           </p>
    //           <p className="text-green-400 font-semibold mt-2">
    //             ₹{product.product_mrp}
    //           </p>
    //         </div>
    //       ))
    //     ) : (
    //       <p className="text-lg text-gray-400">No products listed yet.</p>
    //     )}
    //   </div>
    // </div>

    <div className="bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-semibold mb-6">Your Listed Products</h1>
      <div className="w-4/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products && products.length > 0 ? (
          products.slice(0, visibleCount).map((product) => (
            <div
              key={product.product_id}
              onClick={() => handleProductClick(product.product_id)}
              className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center cursor-pointer"
            >
              <img
                src={product.product_image}
                alt="product"
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-xl font-bold mt-4">{product.product_name}</h3>
              <p className="text-gray-300 text-sm mt-2">
                {product.product_description}
              </p>
              <p className="text-green-400 font-semibold mt-2">
                Price ₹{product.product_mrp}
              </p>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-400">No products listed yet.</p>
        )}
      </div>

      {/* Show "See More" button only if there are more products */}
      {visibleCount < products.length && (
        <button
          onClick={handleShowMore}
          className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
        >
          See More
        </button>
      )}
    </div>
  );
}

export default MyProfile;
