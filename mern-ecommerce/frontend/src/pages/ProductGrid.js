import React, { useEffect, useState } from 'react'; 
import ProductDetail from './ProductDetail';
import axios from 'axios';  // Axios will help with fetching data
import './ProductGrid.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles } from '@fortawesome/free-solid-svg-icons';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sortOption, setSortOption] = useState('newest'); // Default sort option
    const [page, setPage] = useState(1); // Track the current page for pagination
    const [hasMore, setHasMore] = useState(true); // To check if there are more products to fetch

    // Fetch products from backend with pagination
    const fetchProducts = async (pageNumber = 1) => {
        try {
            const { data } = await axios.get(`https://merntest-1.onrender.com/api/drawings?page=${pageNumber}&limit=30`);
            setProducts((prevProducts) => [...prevProducts, ...data.drawings]); // Append new products to existing ones
            setHasMore(pageNumber < data.totalPages); // Set if there are more pages to load
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    // Infinite scroll logic
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

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

    if (loading && page === 1) {
        return <h2>Loading...</h2>;
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
                    <option value="likes">Uppest</option>
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
                        <p>{product.likes} <FontAwesomeIcon icon={faHandSparkles} /></p> {/* Display likes */}
                    </div>
                ))}
            </div>

            {loading && page > 1 && <h2>Loading more products...</h2>}

            {selectedProduct && (
                <ProductDetail product={selectedProduct} onClose={handleCloseDetail} />
            )}
        </div>
    );
};

export default ProductGrid;
