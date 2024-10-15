// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BlogPage from './pages/BlogPage';
import ShopPage from './pages/ShopPage';
import ContactPage from './pages/ContactPage';
import BottomNav from './pages/BottomNav';
import AudioPlayer from './pages/AudioPlayer'; // Import the new AudioPlayer component
import './Styles.css';

const playlist = [
  '/music/1.mp3',
  '/music/2.mp3',
  '/music/3.mp3',
  '/music/4.mp3',
  '/music/5.mp3',
]; // Example playlist, add your own music files

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <BottomNav />
        <AudioPlayer playlist={playlist} /> {/* Autoplay music */}
      </div>
    </Router>
  );
}

export default App;
