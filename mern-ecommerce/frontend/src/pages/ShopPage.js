import React from 'react';
import ProductGrid from './ProductGrid'; // Adjust the import path as necessary
import './ShopPage.css'; // Import the CSS file for responsiveness

const ShopPage = () => {
    return (
        <div className="shop-page-container">
            <h1 className="shop-title">admire Our hard work</h1>
            <ProductGrid />
        </div>
    );
};

export default ShopPage;
