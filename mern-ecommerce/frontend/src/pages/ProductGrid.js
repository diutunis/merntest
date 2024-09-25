import React, { useEffect, useState } from 'react'; 
import ProductDetail from './ProductDetail';
import axios from 'axios';  // Axios will help with fetching data
import './ProductGrid.css';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sortOption, setSortOption] = useState('newest'); // Default sort option

    useEffect(() => {
        // Fetch products from backend
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('https://merntest-1.onrender.com/api/drawings'); // API call to get products
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

    // Handle sorting option change
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Sort products based on the selected option
    const sortedProducts = [...products].sort((a, b) => {
        if (sortOption === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt); // Sort by newest
        } else if (sortOption === 'likes') {
            return b.likes - a.likes; // Sort by likes
        }
        return 0;
    });

    if (loading) {
        return <h2>Loading products...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <div className="sorting-options">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" value={sortOption} onChange={handleSortChange}>
                    <option value="newest">Newest</option>
                    <option value="likes">Most Liked</option>
                </select>
            </div>

            <div className="product-grid">
                {sortedProducts.map((product) => (
                    <div
                        key={product._id} // Use _id as a key from MongoDB
                        className="product-card"
                        onClick={() => handleProductClick(product)}
                    >
                        <img src={product.drawing} alt={product.createdAt} />
                        <h3>{product.name}</h3>
                        <p>{product.likes} Likes</p> {/* Display likes */}
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
