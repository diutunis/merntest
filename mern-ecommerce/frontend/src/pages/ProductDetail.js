// ProductDetail.js
import React from 'react';

const ProductDetail = ({ product, onClose }) => {
    return (
        <div className="product-detail-overlay">
            <div className="product-detail">
                <button onClick={onClose}>Close</button>
                <img src={product.image} alt={product.name} />
                <h2>{product.name}</h2>
                <p>{product.description}</p>
            </div>
        </div>
    );
};

export default ProductDetail;
