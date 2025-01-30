import React from "react";
import Navbar from "../Components/Navbar";
import item1 from '../assets/item1.png';

const CustomerDashBoard = () => {
    return(
        <>
            <Navbar />
            <div className="home-container" style={{ backgroundImage: `url(${item1})` }}>
            </div>
        </>
    );
}
export default CustomerDashBoard;