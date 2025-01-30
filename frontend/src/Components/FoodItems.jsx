import React from "react";
import FoodCard from "./FoodCard";
import item3 from "../assets/item3.png"; // Example food image
import "./FoodItems.css";

const foodItems = [
    { id: "pizza1", title: "Pizza", price: 100, image: item3, canteen: "Nath Canteen", location: "MNNIT Allahabad" },
    { id: "pizza2", title: "Cheese Pizza", price: 120, image: item3, canteen: "Nath Canteen", location: "MNNIT Allahabad" },
    { id: "pizza3", title: "Veg Pizza", price: 90, image: item3, canteen: "Nath Canteen", location: "MNNIT Allahabad" },
    { id: "pizza4", title: "Paneer Pizza", price: 150, image: item3, canteen: "Nath Canteen", location: "MNNIT Allahabad" },
    { id: "pizza5", title: "BBQ Pizza", price: 130, image: item3, canteen: "Nath Canteen", location: "MNNIT Allahabad" },
];

const FoodItems = () => {
    return (
        <div className="food-grid">
            {foodItems.map((item) => (
                <FoodCard key={item.id} {...item} />
            ))}
        </div>
    );
};

export default FoodItems;