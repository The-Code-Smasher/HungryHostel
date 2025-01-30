import React from "react";
import Navbar from "../Components/Navbar";
import item1 from '../assets/item1.png';
import CategoryMenu from "../Components/CategoryMenu";
import "./CustomerDashBoard.css";
import FoodItems from "../Components/FoodItems";
import FeatureFoodSlider from "../Components/FeatureFoodSilder";

const CustomerDashBoard = () => {
    return(
        <>
            <Navbar />
            <div className="home-container" style={{ backgroundImage: `url(${item1})`}}></div>
            <FeatureFoodSlider/>
            <CategoryMenu />
            <FoodItems />
        </>
    );
}
export default CustomerDashBoard;