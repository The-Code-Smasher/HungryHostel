import React, { useState } from "react";
import "./ResturantDashboard.css";
import axios from "axios";
import { MdCurrencyRupee, MdFastfood, MdPhoto, MdRestaurant } from "react-icons/md";
import { TbCategory, TbListDetails } from "react-icons/tb";
import { Link } from "react-router-dom";

const ListProductAddForm = ({ setIsOpen }) => {
    const [product, setProduct] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        canteen: "",
        images: null,
    });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProduct({ ...product, images: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(product).forEach((key) => formData.append(key, product[key]));

        try {
            await axios.post("http://localhost:8000/resturant/listproductaddform", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Product added successfully");
            setIsOpen(false); // Close the popup
        } catch (error) {
            alert("Error adding product: " + error.message);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <MdFastfood className="icon" />
                        <input type="text" name="name" placeholder="Food name" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <TbListDetails className="icon" />
                        <input type="text" name="description" placeholder="Description" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <MdCurrencyRupee className="icon" />
                        <input type="text" name="price" placeholder="Price" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <TbCategory className="icon" />
                        <select name="category" onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snacks">Snacks</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <MdRestaurant className="icon" />
                        <input type="text" name="canteen" placeholder="Canteen name" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <MdPhoto className="icon" />
                        <input type="file" name="images" onChange={handleFileChange} required />
                    </div>

                    <button className="post-food" type="submit">Post Food</button>

                    <Link to="/resturant">
                        <button className="post-food res-home">Home</button>
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default ListProductAddForm;
