import React from 'react'

function VegetableCard({ item }) {
    return (
        <div className='mt-24 ml-4 gap-y-4 flex flex-col mb-24 items-start h-56 w-96 shadow-lg rounded-md z-20 border-2 border-r-blue-200 border-gray-300'>
            <h1 className='ml-4 mt-4 font-bold text-2xl '>{item.name}</h1>
            <p className='ml-4 font-semibold '>{item.about}</p>
            <div className='ml-4'>
                <button className=' px-2 py-1 bg-green-600 hover:bg-green-300 cursor-pointer text-sm text-white rounded-lg transition-all '>Shop Now</button>
            </div>

            <div className='relative h-full w-full'>
                <img src={item.url} alt="vegetable-img" className='absolute bottom-2 right-0 h-24 w-28' />
            </div>
        </div>
    )
}

export default VegetableCard