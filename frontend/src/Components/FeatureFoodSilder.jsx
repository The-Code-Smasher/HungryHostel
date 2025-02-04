import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FeatureFoodSlider.css";
import item1 from "../assets/item4.png";
import item2 from "../assets/item2.png";
import item3 from "../assets/item3.png";
import item4 from "../assets/item4.png";

const FeatureFoodSlider = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 900,
        slidesToShow: 7,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1200, // Large screens
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 992, // Medium screens (tablets)
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768, // Small screens (mobile landscape)
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480, // Extra small screens (mobile portrait)
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };
      

    const foodItems = [
        { id: 1, name: "Pizza", image: item1 },
        { id: 2, name: "Burger", image: item2 },
        { id: 3, name: "Pasta", image: item3 },
        { id: 4, name: "Sushi", image: item4 },
        { id: 2, name: "Burger", image: item2 },
        { id: 4, name: "Sushi", image: item4 },
        { id: 2, name: "Burger", image: item2 },
    ];

    return (
        <div className="slider-container">
            <h3 className="slider-title">Featured Food Items</h3>
            <Slider {...settings}>
                {foodItems.map((item) => (
                <div className="SlideOut" key={item.id} >
                   <div className="slide"> <img src={item.image} alt={item.name} className="food-image" />
                   <h3 className="food-name">{item.name}</h3></div>
                </div>
                ))}
            </Slider>
        </div>
    );
};

export default FeatureFoodSlider;