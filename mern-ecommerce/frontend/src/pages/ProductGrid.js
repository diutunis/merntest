import React, { useEffect, useState } from 'react';
import ProductDetail from './ProductDetail';
import axios from 'axios';  // Axios will help with fetching data

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        // Fetch products from backend
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products'); // API call to get products
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseDetail = () => {
        setSelectedProduct(null);
    };

    if (loading) {
        return <h2>Loading products...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <div className="product-grid">
                {products.map((product) => (
                    <div
                        key={product._id} // Use _id as a key from MongoDB
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
