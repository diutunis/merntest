import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import './Styles.css'; // Make sure to import your styles
import BlogPage from './pages/BlogPage';
import ShopPage from './pages/ShopPage';
import ContactPage from './pages/ContactPage';
import BottomNav from './pages/BottomNav'; // Import the BottomNav component



// App.js

import ProductGrid from './pages/ProductGrid';




function App() {
    return (
        <Router>
  <div className="app-container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/contact" element={<ContactPage />} />
<Route path="/login" element={<LoginPage />} />\
         
                </Routes>
       <BottomNav /> {/* Include the BottomNav component */}
</div>
        </Router>
    
    );
}

export default App;
