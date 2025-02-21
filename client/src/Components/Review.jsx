import React, { useState } from 'react';
import ReviewCard from './ReviewCard';
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

const groceryItemData = [
    {

        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKXBg5bTNg12TJnGqAvsV75nLC_EulpcHRqWdlZb28WWefBa_H0Outibfpokkk9SbBb5Q&usqp=CAU",
        itemName: "Organic Apples",
        review: {
            rating: 4.5,
            comment: "These apples are fresh and have a great taste. A bit expensive, but worth it for the quality!",
            reviewer: "Jane Doe",
            date: "2024-05-17"
        },
    },
    {
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKXBg5bTNg12TJnGqAvsV75nLC_EulpcHRqWdlZb28WWefBa_H0Outibfpokkk9SbBb5Q&usqp=CAU",

        itemName: "Whole Grain Bread",
        review: {
            rating: 5,
            comment: "Absolutely love this bread! It's hearty, healthy, and tastes amazing.",
            reviewer: "John Smith",
            date: "2024-05-16"
        },
        pictureUrl: "https://example.com/images/whole-grain-bread.jpg"
    },
    {
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKXBg5bTNg12TJnGqAvsV75nLC_EulpcHRqWdlZb28WWefBa_H0Outibfpokkk9SbBb5Q&usqp=CAU",

        itemName: "Almond Milk",
        review: {
            rating: 4,
            comment: "Good alternative to dairy milk, but slightly on the sweeter side.",
            reviewer: "Emily Brown",
            date: "2024-05-15"
        },
        pictureUrl: "https://example.com/images/almond-milk.jpg"
    },
    {
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKXBg5bTNg12TJnGqAvsV75nLC_EulpcHRqWdlZb28WWefBa_H0Outibfpokkk9SbBb5Q&usqp=CAU",

        itemName: "Greek Yogurt",
        review: {
            rating: 4.8,
            comment: "Thick, creamy, and perfect for breakfast with some honey and granola.",
            reviewer: "Chris Johnson",
            date: "2024-05-14"
        },
        pictureUrl: "https://example.com/images/greek-yogurt.jpg"
    },
    {
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKXBg5bTNg12TJnGqAvsV75nLC_EulpcHRqWdlZb28WWefBa_H0Outibfpokkk9SbBb5Q&usqp=CAU",

        itemName: "Free-Range Eggs",
        review: {
            rating: 5,
            comment: "These eggs are incredibly fresh and make a noticeable difference in taste.",
            reviewer: "Patricia Lee",
            date: "2024-05-13"
        },
        pictureUrl: "https://example.com/images/free-range-eggs.jpg"
    },
    {
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKXBg5bTNg12TJnGqAvsV75nLC_EulpcHRqWdlZb28WWefBa_H0Outibfpokkk9SbBb5Q&usqp=CAU",

        itemName: "Organic Carrots",
        review: {
            rating: 4.2,
            comment: "Crisp and sweet. Great for snacking and cooking.",
            reviewer: "Michael Green",
            date: "2024-05-12"
        },
        pictureUrl: "https://example.com/images/organic-carrots.jpg"
    },
    {
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKXBg5bTNg12TJnGqAvsV75nLC_EulpcHRqWdlZb28WWefBa_H0Outibfpokkk9SbBb5Q&usqp=CAU",

        itemName: "Quinoa",
        review: {
            rating: 4.7,
            comment: "A versatile grain that is a staple in our pantry. Cooks up fluffy every time.",
            reviewer: "Sarah Walker",
            date: "2024-05-11"
        },
        pictureUrl: "https://example.com/images/quinoa.jpg"
    },
    {
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKXBg5bTNg12TJnGqAvsV75nLC_EulpcHRqWdlZb28WWefBa_H0Outibfpokkk9SbBb5Q&usqp=CAU",

        itemName: "Extra Virgin Olive Oil",
        review: {
            rating: 5,
            comment: "High-quality oil with a rich flavor. Perfect for salads and cooking.",
            reviewer: "David Martinez",
            date: "2024-05-10"
        },
        pictureUrl: "https://example.com/images/extra-virgin-olive-oil.jpg"
    },
    {
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKXBg5bTNg12TJnGqAvsV75nLC_EulpcHRqWdlZb28WWefBa_H0Outibfpokkk9SbBb5Q&usqp=CAU",

        itemName: "Fair Trade Coffee",
        review: {
            rating: 4.9,
            comment: "Smooth and robust flavor. Plus, it supports fair trade practices!",
            reviewer: "Linda Thompson",
            date: "2024-05-09"
        },
        pictureUrl: "https://example.com/images/fair-trade-coffee.jpg"
    },
    {
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKXBg5bTNg12TJnGqAvsV75nLC_EulpcHRqWdlZb28WWefBa_H0Outibfpokkk9SbBb5Q&usqp=CAU",

        itemName: "Organic Spinach",
        review: {
            rating: 4.3,
            comment: "Fresh and crisp. Great for salads and smoothies.",
            reviewer: "James Wilson",
            date: "2024-05-08"
        },
        pictureUrl: "https://example.com/images/organic-spinach.jpg"
    }
];

function Review() {
    const [currIdx, setCurrIdx] = useState(0);

    function previousButtonHandler() {
        setCurrIdx((prevIndex) => (prevIndex - 1 + groceryItemData.length) % groceryItemData.length);
    }

    function nextButtonHandler() {
        setCurrIdx((prevIndex) => (prevIndex + 1) % groceryItemData.length);
    }

    const itemsToShow = [
        groceryItemData[currIdx],
        groceryItemData[(currIdx + 1) % groceryItemData.length],
        groceryItemData[(currIdx + 2) % groceryItemData.length]
    ];

    return (

        <div className=" ">

            <div className="flex h-96  w-full mt-4">

                <div className="flex space-x-4 mx-auto h-full w-[88%] items-center justify-evenly bg-[#ffffffde]">
                    <GrPrevious onClick={previousButtonHandler} className='cursor-pointer rounded-full text-2xl font-bold' />

                    {itemsToShow.map((item, index) => (
                        <ReviewCard key={index} item={item} />
                    ))}

                    <GrNext onClick={nextButtonHandler} className=' cursor-pointer text-2xl rounded-full font-bold' />
                </div>



            </div>
        </div>
    );
}

export default Review;
