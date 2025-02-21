import React from 'react'
import { TbTruckDelivery } from "react-icons/tb";


function Homebottom() {
    return (
        <div className='bg-[#111111] w-full h-44 '>
            <div className='flex justify-evenly items-center '>
                <button className='bg-[#f8f6f3d7] py-2 px-6 mt-16'>
                    <div className='flex'><TbTruckDelivery className='mt-1' /><h4>Free Shipping</h4></div>
                    <p>Above $5 only</p>
                </button>
                <button className='bg-[#f8f6f3d7] py-2 px-6 mt-16'>
                    <div className='flex'><TbTruckDelivery className='mt-1' /><h4>Certified Organic</h4></div>
                    <p>100% Guarentee</p>
                </button>
                <button className='bg-[#f8f6f3d7] py-2 px-6 mt-16'>
                    <div className='flex'><TbTruckDelivery className='mt-1' /><h4>Huge Savings</h4></div>
                    <p>At Lowest Price</p>
                </button>
                <button className='bg-[#f8f6f3d7] py-2 px-6 mt-16'>
                    <div className='flex'><TbTruckDelivery className='mt-1' /><h4>Easy Returns</h4></div>
                    <p>No Questions Asked</p>
                </button>

            </div>
        </div>
    )
}

export default Homebottom