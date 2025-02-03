import { useState } from "react";
import axios from "axios";
import "./ProductForm.css";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "Breakfast",
    price: "",
    description: "",
    stock: "",
    status: "Available",
    images: [],
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/addProducts", product);
      alert("Product added successfully");
    } catch (error) {
      alert("Error adding product: " + error.message);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <input className="product-data" type="text" name="name" placeholder="Product Name" onChange={handleChange} required />
      <select className="product-data" name="category" onChange={handleChange}>
        <option>Breakfast</option>
        <option>Lunch</option>
        <option>Dinner</option>
        <option>Snacks</option>
        <option>Beverages</option>
      </select>
      <input className="product-data" type="number" name="price" placeholder="Price" onChange={handleChange} required />
      <textarea className="product-data" name="description" placeholder="Description" onChange={handleChange} required></textarea>
      <button className="product-data product-submit" type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
