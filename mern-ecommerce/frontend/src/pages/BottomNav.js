// src/components/BottomNav.js
import React from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenNib, faPaperclip, faBoxOpen, faPersonBurst } from '@fortawesome/free-solid-svg-icons';


import './BottomNav.css'; // CSS for styling the navigation bar

const BottomNav = () => {
    return (
        <div className="bottom-nav">
            <Link to="/" className="nav-item">
                <FontAwesomeIcon icon={faPenNib} />
                <span></span>
            </Link>
            <Link to="/blog" className="nav-item">
  <FontAwesomeIcon icon={faPaperclip} />
                <span></span>
            </Link>
            <Link to="/shop" className="nav-item">
                <FontAwesomeIcon icon={faBoxOpen} /> 
                <span></span>
            </Link>
            <Link to="/contact" className="nav-item">
               <FontAwesomeIcon icon={faPersonBurst} />
                <span></span>
            </Link>
        </div>
    );
};

export default BottomNav;