// src/components/BottomNav.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBlog, faShoppingCart, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './BottomNav.css'; // CSS for styling the navigation bar

const BottomNav = () => {
    return (
        <div className="bottom-nav">
            <Link to="/" className="nav-item">
                <FontAwesomeIcon icon={faHome} />
                <span>Home</span>
            </Link>
            <Link to="/blog" className="nav-item">
                <FontAwesomeIcon icon={faBlog} />
                <span>Blog</span>
            </Link>
            <Link to="/shop" className="nav-item">
                <FontAwesomeIcon icon={faShoppingCart} />
                <span>Shop</span>
            </Link>
            <Link to="/contact" className="nav-item">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Contact</span>
            </Link>
        </div>
    );
};

export default BottomNav;