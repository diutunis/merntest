import React, { useEffect, useState } from 'react';
import ProductDetail from './ProductDetail';
import axios from 'axios';  // Axios will help with fetching data
import './ProductGrid.css';


const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
    const [drawings, setDrawings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('newest'); // Default sort by newest

    useEffect(() => {
        // Fetch existing drawings from the backend when the component loads
        const fetchDrawings = async () => {
            try {
                const response = await fetch('https://merntest-1.onrender.com/api/drawings');
                const data = await response.json();
                setDrawings(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load drawings');
                setLoading(false);
            }
        };
        fetchDrawings();
    }, []);

    // Handle sorting option change
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Sort drawings based on the selected option
    const sortedDrawings = [...drawings].sort((a, b) => {
        if (sortOption === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt); // Sort by newest
        } else if (sortOption === 'likes') {
            return b.likes - a.likes; // Sort by likes
        }
        return 0;
    });

    if (loading) {
        return <h2>Loading drawings...</h2>;
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

            <div className="drawing-grid">
                {sortedDrawings.map((drawing) => (
                    <div key={drawing._id} className="drawing-card">
                        <img src={drawing.drawing} alt={drawing.createdAt} />
                        <h3>{drawing.name}</h3>
                        <p>{drawing.likes} Likes</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
