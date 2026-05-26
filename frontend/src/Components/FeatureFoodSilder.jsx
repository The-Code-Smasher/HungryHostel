import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './FeatureFoodSlider.css';
import item1 from '../assets/item4.png';
import item2 from '../assets/item2.png';
import item3 from '../assets/item3.png';
import item4 from '../assets/item4.png';

const FOOD_ITEMS = [
    { id: 1, name: 'Breakfast',  icon: item1, category: 'breakfast' },
    { id: 2, name: 'Lunch',      icon: item2, category: 'lunch' },
    { id: 3, name: 'Dinner',     icon: item3, category: 'dinner' },
    { id: 4, name: 'Snacks',     icon: item4, category: 'snacks' },
    { id: 5, name: 'Breakfast',  icon: item1, category: 'breakfast' },
    { id: 6, name: 'Lunch',      icon: item2, category: 'lunch' },
    { id: 7, name: 'Dinner',     icon: item3, category: 'dinner' },
];

const FeatureFoodSlider = ({ onCategoryChange }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 7,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,   // FIX: was 91000 (91 seconds), reduced to 2.5s
        arrows: false,
        responsive: [
            { breakpoint: 1025, settings: { slidesToShow: 6 } },
            { breakpoint: 770,  settings: { slidesToShow: 4 } },
            { breakpoint: 550,  settings: { slidesToShow: 3 } },
            { breakpoint: 440,  settings: { slidesToShow: 2 } },
        ],
    };

    return (
        <section className="ffs-section" aria-label="Browse by category">
            <div className="ffs-inner">
                <Slider {...settings}>
                    {FOOD_ITEMS.map((item, i) => (
                        <div key={`${item.id}-${i}`} className="ffs-slide-wrap">
                            <button
                                className="ffs-chip"
                                onClick={() => onCategoryChange?.(item.category)}
                                aria-label={`Filter by ${item.name}`}
                            >
                                <div className="ffs-img-wrap">
                                    <img src={item.icon} alt={item.name} className="ffs-img" />
                                </div>
                                <span className="ffs-label">{item.name}</span>
                            </button>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default FeatureFoodSlider;