import React from 'react'
import { BsCurrencyDollar } from "react-icons/bs";
import { useDispatch } from 'react-redux';
import { addProduct } from '../Redux/Slice/CartSlice';
import { useNavigate } from 'react-router-dom';

function SellingCard({ item, isLoggedIn }) {

    // console.log("Logged in selling card : " + isLoggedIn);
    // const cart = useSelector((state) => state.cart);
    // console.log(cart);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addToCart = () => {
        if (isLoggedIn) {
            dispatch(addProduct(item));
        } else {
            navigate("/login");
        }
    };

    return (
        <div className='flex flex-row rounded-lg m-4 gap-x-28 items-start shadow-lg p-4 bg-[#f8f6f3d7] '>
            <div className='ml-4'>
                <img src={item.url} className='h-40 w-40 mt-2 ' />
                <p className='text-md'>Grocery</p>
                <h2 className='text-xl font-bold'>{item.name}</h2>
                <div className='flex'>
                    <BsCurrencyDollar className='mt-3 font-[800]' /><p className='text-xl font-bold mt-1'>{item.price}</p>
                </div>

                <button className="text-gray-700 border-2 border-gray-700 rounded-full font-semibold 
                        text-[12px] p-1 px-3 uppercase 
                        hover:bg-gray-700
                        hover:text-white transition duration-300 ease-in"
                    onClick={addToCart}
                >
                    Add To Cart
                </button>

            </div>
        </div>
    )
}

export default SellingCard
