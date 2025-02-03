import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/listProducts");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list-container">
      <h1 className="product-title">Product List</h1>
      <ul className="product-ul">
        {products.length > 0 ? (
          products.map((product) => (
            <li className="product-li" key={product._id}>
              <h2 className="product-name">{product.name}</h2>
              <p className="product-p"><strong>Category:</strong> {product.category}</p>
              <p className="product-p"><strong>Price:</strong> ${product.price}</p>
              <p className="product-p"><strong>Description:</strong> {product.description}</p>
              <p className="product-p"><strong>Stock:</strong> {product.stock}</p>
              <p className="product-p"><strong>Status:</strong> {product.status}</p>
              {product.images.length > 0 && <img src={product.images[0]} alt={product.name} className="product-image" />}
            </li>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </ul>
    </div>
  );
};

export default ProductList;
