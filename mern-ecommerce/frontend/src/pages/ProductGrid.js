
// ProductGrid.js
import React, { useState } from 'react';
import ProductDetail from './ProductDetail';

const products = Array.from({ length: 8 }, (_, index) => ({
    id: index,
    name: `Product ${index + 1}`,
    image: 'https://via.placeholder.com/150', // Placeholder image
    description: 'This is a placeholder description for the product.',
}));

const ProductGrid = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseDetail = () => {
        setSelectedProduct(null);
    };

    return (
        <div>
            <div className="product-grid">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="product-card"
                        onClick={() => handleProductClick(product)}
                    >
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <ProductDetail product={selectedProduct} onClose={handleCloseDetail} />
            )}
        </div>
    );
};

export default ProductGrid;

