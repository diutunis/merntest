// src/components/BottomNav.js
import React from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fa-solid fa-pen-nib, fa-regular fa-file-lines, faShoppingCart, faEnvelope } from '@fortawesome/free-solid-svg-icons';


import './BottomNav.css'; // CSS for styling the navigation bar

const BottomNav = () => {
    return (
        <div className="bottom-nav">
            <Link to="/" className="nav-item">
                <FontAwesomeIcon icon="fa-solid fa-pen-nib" />
                <span></span>
            </Link>
            <Link to="/blog" className="nav-item">
             <FontAwesomeIcon icon="fa-regular fa-file-lines" />
                <span></span>
            </Link>
            <Link to="/shop" className="nav-item">
                <FontAwesomeIcon icon={faShoppingCart} />
                <span></span>
            </Link>
            <Link to="/contact" className="nav-item">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Contact</span>
            </Link>
        </div>
    );
};

export default BottomNav;