import React from "react";
import Navbar from "../Components/Navbar";
import item1 from '../assets/item1.png';
import CategoryMenu from "../Components/CategoryMenu";
import "./CustomerDashBoard.css";
import FoodItems from "../Components/FoodItems";
import FeatureFoodSlider from "../Components/FeatureFoodSilder";
import ToggleSearch from "../Components/ToggleSearch";
import { FaSearch } from "react-icons/fa";

const CustomerDashBoard = () => {
    return (
        <>
            <ToggleSearch />
            <Navbar />
            <div className="home-container" style={{ backgroundImage: `url(${item1})` }}>
                <div className="dashboard-content">
                    <h1 className="hungryhst">HUNGRY HOSTEL</h1>
                    <h4 className="slogan">SATISFY YOUR CRAVING WITHIN CAMPUS!</h4>
                    
                    {/* Search Bar */}
                    <div className="dashboard-search">
                        <input className="search" type="search" placeholder="Search food items..." />
                        <button > 
                            <FaSearch />
                        </button>
                    </div>
                </div>
            </div>
            <FeatureFoodSlider />
            <CategoryMenu />
            <FoodItems />
        </>
    );
};

export default CustomerDashBoard;
