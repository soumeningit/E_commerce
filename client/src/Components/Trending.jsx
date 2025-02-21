import SellingCard from "./SellingCard"
import leaf from '../image/logo-leaf-new.png'

const data = [
    {
        name: "Farm Fresh Fruits",
        about: "Ut sollicitudin quam vel purus tempus, vel eleifend felis varius.",
        url: "https://www.futurefit.co.uk/wp-content/uploads/2019/08/shutterstock_1934467364-scaled.jpg",
        price: 35
    },
    {
        name: "Orange Juice",
        about: "Aliquam porta justo nibh, id laoreet sapien sodales vitae justo.",
        url: "https://summersnowjuice.com.au/cdn/shop/products/A08I1344_600x.jpg?v=1681343636",
        price: 19
    },
    {
        name: "Organic Legume",
        about: "Phasellus sed urna mattis, viverra libero sed, aliquam est",
        url: "https://static.vecteezy.com/system/resources/previews/030/761/257/non_2x/different-type-of-raw-dry-legumes-composition-mix-organic-legume-concept-photo.jpg",
        price: 25
    }
]
function Trending() {
    return (
        <div className="bg-[#f8f6f3d7] flex mx-auto justify-evenly w-full flex-col">
            <div className='flex mx-auto flex-col object-cover gap-y-8'>
                <h1 className='font-bold text-xl'>Best Selling Products</h1>
                <img src={leaf} alt="leaf-img" className='w-12 mx-auto items-center mb-8' />
            </div>
            <div className="flex w-[90%] mx-auto">
                {
                    data.map((item) => {
                        return <SellingCard item={item} className='flex' />
                    })
                }
            </div>
        </div>
    )
}

export default Trending