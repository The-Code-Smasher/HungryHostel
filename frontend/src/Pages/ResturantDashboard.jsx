import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use navigate for routing
import logo from "../assets/logo.png";
import image from "../assets/image.jpeg";

const RestaurantDashboard = () => {
    const navigate = useNavigate();
    return (
        <>
            <div>
                <div className="navbar-rest">
                    <img className = "logor" src={logo} alt="Restaurant Logo" />
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
                    <h1 className="rTitle">Welcome, Restaurant Owner!</h1>
                    <div className="restaurant-container">
                        <img src={image} alt="Restaurant Image" className="restaurant-img" />
                        <div className="restaurant-text">
                            <h2 className="rname">Restaurant Name</h2>
                            <p className="rslogan">Best place to enjoy delicious meals!</p>
                        </div>
                    </div>

                    <div className="filter-buttons">
                        <button className="f_buttons">All</button>
                        <button className="f_buttons">Lunch</button>
                        <button className="f_buttons">Breakfast</button>
                        <button className="f_buttons">Dinner</button>
                    </div>

                    <div className="cards-rest">
                    <div className="food-card-rest">
                        <img src={logo} alt="Posted Food" />
                        <h3>Delicious Meal</h3>
                        <p>Description of the food item goes here.</p>
                        <p><strong>Price: ₹10</strong></p>
                    </div>
                    <div className="food-card-rest">
                        <img src={logo} alt="Posted Food" />
                        <h3>Delicious Meal</h3>
                        <p>Description of the food item goes here.</p>
                        <p><strong>Price: ₹10</strong></p>
                    </div>
                    <div className="food-card-rest">
                        <img src={logo} alt="Posted Food" />
                        <h3>Delicious Meal</h3>
                        <p>Description of the food item goes here.</p>
                        <p><strong>Price: ₹10</strong></p>
                    </div>
                    <div className="food-card-rest">
                        <img src={logo} alt="Posted Food" />
                        <h3>Delicious Meal</h3>
                        <p>Description of the food item goes here.</p>
                        <p><strong>Price: ₹10</strong></p>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RestaurantDashboard;
