import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import './Styles.css'; // Make sure to import your styles

// App.js

import ProductGrid from './pages/ProductGrid';




function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
         
 </Routes>
        </Router>
    
    );
}

export default App;
