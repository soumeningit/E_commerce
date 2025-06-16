import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TbFileDescription } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { FcAbout, FcAddressBook } from "react-icons/fc";
import { useSelector } from "react-redux";
import Modal from "../Components/Modal";
import { getProductDetailsAPI } from "../Service/Operations/ProductOpern";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import ProductReview from "../Components/ProductReview";
import CartModal from "../Components/CartModal";
import toast from "react-hot-toast";
import { addItemsToCart } from "../Service/Operations/CartOpern";

function ProductPage() {
  const { name, id } = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState([]);

  const [showCartModal, setShowCartModal] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const { user, token } = useSelector((state) => state.auth);

  const location = useLocation();

  const { productDetails } = location.state || {};

  async function getProductDetails() {
    try {
      const response = await getProductDetailsAPI("GET", { id: id });
      if (response.status === 200) {
        setData(response?.data?.data);
      }
    } catch (error) {
      console.log("Error in getProductDetails: ", error);
    }
  }

  useEffect(() => {
    setData(productDetails);
    if (!productDetails) {
      getProductDetails();
    }
  }, []);

  // function handleBuyNow(price, listedFor) {
  //   if (!user || !token) {
  //     setShowModal(true);
  //     return;
  //   } else {
  //     navigate(`/product-details/${listedFor}/${name}/pid_${id}/sell-product`, {
  //       state: { price: price, productId: id, listedFor: listedFor },
  //     });
  //   }
  // }

  function handleAddToCart(price, productId) {
    if (!user || !token) {
      setShowModal(true);
      return;
    }
    setShowCartModal(true);
  }

  const addToCart = async (productId, price) => {
    const toastId = toast.loading("Loading...");
    try {
      const data = {
        userId: user.id,
        productId: productId,
        quantity: quantity,
        product_price: price,
        total_price: totalPrice,
      };
      const response = await addItemsToCart("POST", data, token);
      if (response.status === 200) {
        toast.dismiss(toastId);
        toast.success("Product added to cart successfully");
        setShowCartModal(false);
      } else {
        toast.dismiss(toastId);
        toast.error("Error in adding product to cart");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error in adding product to cart");
      setShowCartModal(false);
      console.log("Error in add to cart: ", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10 text-gray-800">
      <div className="grid md:grid-cols-2 gap-10">
        {Array.isArray(data) &&
          data.map((item, index) => {
            return (
              <div key={index} className="md:col-span-2">
                {/* Product Image and Info */}
                <div className="grid md:grid-cols-2 gap-10">
                  {/* Product Image */}
                  <div>
                    <img
                      src={item?.product_image}
                      alt="product_image"
                      className="rounded-xl shadow-md w-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-indigo-600">
                      {item?.product_name}
                    </h1>

                    <div className="bg-indigo-100 max-w-fit text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {item?.category_name}
                    </div>
                    <p className="text-gray-600 text-sm font-semibold">
                      {item?.short_desc}
                    </p>

                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">Overview</h2>
                      <p className="flex items-center gap-2 text-gray-600">
                        <TbFileDescription className="text-indigo-500" />
                        <span key={index} className="text-gray-600">
                          {item.short_desc}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 text-gray-600">
                        <SlCalender className="text-indigo-500" />
                        {item?.creation_time?.split("T")[0]}
                      </p>
                    </div>

                    <div>
                      <h2 className="flex items-center text-xl font-semibold text-gray-800 gap-2">
                        <FcAbout /> Description
                      </h2>
                      <p className="mt-2 text-gray-600 leading-relaxed">
                        {item?.medium_desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <h1 className="text-2xl font-bold text-green-600 flex items-center gap-1">
                        <span>₹{item?.product_mrp}</span>
                      </h1>
                      {/* <button
                        onClick={() =>
                          handleBuyNow(item?.product_price, item?.listed_for)
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition cursor-pointer"
                      >
                        Buy Now
                      </button> */}
                      <button
                        onClick={() => {
                          setTotalPrice(
                            Number(item?.product_mrp) * Number(quantity)
                          );
                          handleAddToCart(item?.product_mrp, item?.product_id);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition cursor-pointer"
                      >
                        Add to cart
                      </button>
                    </div>

                    <div>
                      <h2 className="flex items-center text-xl font-semibold text-gray-800 gap-2">
                        <FcAddressBook /> Details
                      </h2>
                      <p className="mt-2 text-gray-600 leading-relaxed">
                        {item?.long_desc}
                      </p>
                    </div>
                  </div>
                  {/* Seller Info */}
                  <div className="mt-12 bg-white rounded-xl p-6 shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                      Seller Info
                    </h2>
                    <p className="flex items-center gap-2 text-gray-700 text-sm">
                      <FaRegUserCircle className="text-indigo-500" />{" "}
                      {item?.firstName} {item?.lastName}
                    </p>

                    <div className="mt-4">
                      <h3 className="text-md font-semibold text-gray-800 mb-2">
                        Contact Seller
                      </h3>
                      <div className="flex gap-4">
                        <a
                          href={`mailto:${item?.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg cursor-pointer"
                        >
                          <IoMailOutline /> Email Seller
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* Reviews */}
                  <div className="mt-12 bg-white rounded-xl p-6 shadow-md">
                    <ProductReview id={id} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {showModal && (
        <Modal
          btn1="Login"
          btn2="Cancel"
          heading="Login Required"
          text="You need to login to book a slot."
          onConfirm={() => {
            setShowModal(false);
            navigate("/login");
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
      {showCartModal && (
        <CartModal
          image={data[0]?.product_image}
          name={data[0]?.product_name}
          price={data[0]?.product_mrp}
          addbtn="Add to Cart"
          removebtn="Remove from Cart"
          btn="Cancel"
          quantity={quantity}
          setQuantity={setQuantity}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
          onConfirm={() => {
            addToCart(data[0]?.product_id, data[0]?.product_mrp);
          }}
          onClose={() => setShowCartModal(false)}
        />
      )}
    </div>
  );
}

export default ProductPage;
