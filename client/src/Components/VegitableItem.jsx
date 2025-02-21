import React from 'react'
import VegetableCard from './VegetableCard'

const obj = [
    {
        name: "Farm Fresh Fruits",
        about: "Ut sollicitudin quam vel purus tempus, vel eleifend felis varius.",
        url: "https://www.futurefit.co.uk/wp-content/uploads/2019/08/shutterstock_1934467364-scaled.jpg",
    },
    {
        name: "Fresh Vegetables",
        about: "Aliquam porta justo nibh, id laoreet sapien sodales vitae justo.",
        url: "https://alafwan.com/afwan/wp-content/uploads/2023/07/farm-fresh-vegetables-475x600.jpg"
    },
    {
        name: "Organic Legume",
        about: "Phasellus sed urna mattis, viverra libero sed, aliquam est",
        url: "https://static.vecteezy.com/system/resources/previews/030/761/257/non_2x/different-type-of-raw-dry-legumes-composition-mix-organic-legume-concept-photo.jpg"
    }
]

function VegitableItem() {

    return (
        <div className='bg-[rgba(248,246,243,0.77)] mt-28 flex mx-auto justify-evenly -z-20 '>
            {
                obj.map((item) => {
                    return (<VegetableCard item={item} className='' />)
                })
            }
        </div>
    )
}

export default VegitableItem