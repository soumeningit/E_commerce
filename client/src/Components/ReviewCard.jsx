function ReviewCard({ item }) {

    return (
        <div>
            <div className="flex flex-col justify-evenly rounded-lg mt-4 h-64 w-64 items-start shadow-lg p-4 bg-[#f8f6f3d7] ">

                <div className='flex flex-col items-center justify-center mt-10'>
                    <p>{item.review.comment}</p>
                    <span className='flex mt-4'>
                        <img src={item.imgUrl} alt="img" className='h-8 w-8 rounded-full' />
                        <p>{item.review.reviewer}</p>
                    </span>
                </div>

            </div>
        </div>
    )
}

export default ReviewCard

// const ReviewCard = ({ title, description, image }) => {
//     return (
//         <div className="card">
//             <img src={image} alt={title} />
//             <h2>{title}</h2>
//             <p>{description}</p>
//         </div>
//     );
// };

// const CardCarousel = ({ cards }) => {
//     const [currentCardIndex, setCurrentCardIndex] = useState(0);

//     const prevCard = () => {
//         setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
//     };

//     const nextCard = () => {
//         setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
//     };

//     return (
//         <div className="card-carousel">
//             <button onClick={prevCard}>Previous</button>
//             <Card {...cards[currentCardIndex]} />
//             <button onClick={nextCard}>Next</button>
//         </div>
//     );
// };