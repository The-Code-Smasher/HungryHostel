import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use navigate for routing
import chole from "../assets/chole.png";
import image from "../assets/image.jpeg";

const RestaurantDashboard = () => {
    const navigate = useNavigate();
    return (
        <>
            <div>
                <div className="navbar">
                    <img src={chole} alt="Restaurant Logo" />
                    <div className="nav-buttons">
                        <button
                            className="open-popup-btn post"
                            onClick={() => navigate("/resturant/listproductaddform")} // Open the popup
                        >
                            Post
                        </button>
                        <button className="logout">Logout</button>
                    </div>
                </div>

                <div className="rest-container">
                    <h1>Welcome, Restaurant Owner!</h1>
                    <div className="restaurant-container">
                        <img src={image} alt="Restaurant Image" className="restaurant-img" />
                        <div className="restaurant-text">
                            <h2>Restaurant Name</h2>
                            <p>Best place to enjoy delicious meals!</p>
                        </div>
                    </div>

                    <div className="filter-buttons">
                        <button className="f_buttons">All</button>
                        <button className="f_buttons">Lunch</button>
                        <button className="f_buttons">Breakfast</button>
                        <button className="f_buttons">Dinner</button>
                    </div>

                    <div className="food-card-rest">
                        <img src={chole} alt="Posted Food" />
                        <h3>Delicious Meal</h3>
                        <p>Description of the food item goes here.</p>
                        <p><strong>Price: ₹10</strong></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RestaurantDashboard;
