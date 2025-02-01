import React from "react";
import Navbar from "../Components/Navbar";
import item1 from '../assets/item1.png';
import CategoryMenu from "../Components/CategoryMenu";
import "./CustomerDashBoard.css";
import FoodItems from "../Components/FoodItems";
import FeatureFoodSlider from "../Components/FeatureFoodSilder";
// import ToggleSearch from "../Components/ToggleSearch";

const CustomerDashBoard = () => {
    return(
        <>
            {/* //<ToggleSearch /> */}
            <Navbar />
            <div className="home-container" style={{ backgroundImage: `url(${item1})`}}>
                <div className="dashboard-content">
                    <h1 className="hungryhst">HUNGRY HOSTEL</h1>
                    <h4 className="slogan">SATISY YOUR CRAVING WITHIN CAMPUS !</h4>
                </div>
            </div>
            <FeatureFoodSlider/>
            <CategoryMenu />
            <FoodItems />
        </>
    );
}
export default CustomerDashBoard;