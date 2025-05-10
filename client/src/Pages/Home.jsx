import React from "react";
import HomeContent from "../Components/HomeContent";
import Homebottom from "../Components/Homebottom";
import SellingItem from "../Components/SellingItem";
import ItemsByCategory from "../Components/ItemsByCategory";
import VegitableItem from "../Components/VegitableItem";
import Trending from "../Components/Trending";
import Review from "../Components/Review";
import Footer from "../Components/Footer";

function Home() {
  return (
    <div>
      <HomeContent />
      <Homebottom />
      <SellingItem />
      <ItemsByCategory />
      <VegitableItem />
      <Trending />
      <Review />
      <Footer />
    </div>
  );
}

export default Home;
