import React, { useRef, useState, useEffect } from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawings, setDrawings] = useState([]);
    const [page, setPage] = useState(1); // For pagination
    const [hasMore, setHasMore] = useState(true); // Whether more drawings are available
    const [loading, setLoading] = useState(false); // For loading state

    useEffect(() => {
        const fetchDrawings = async () => {
            if (loading || !hasMore) return; // Avoid double fetching
            setLoading(true);

            const response = await fetch(`https://merntest-1.onrender.com/api/drawings?page=${page}&limit=30`);
            const data = await response.json();

            setDrawings((prevDrawings) => [...prevDrawings, ...data.drawings]);
            setHasMore(data.currentPage < data.totalPages); // Check if there's more to load
            setLoading(false);
        };

        fetchDrawings();
    }, [page]);

    // Infinite scroll effect
    useEffect(() => {
        const handleScroll = () => {
            // Check if user has scrolled to the bottom
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasMore && !loading) {
                setPage((prevPage) => prevPage + 1); // Increment page to load more
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Clean up
    }, [hasMore, loading]);

    const saveDrawing = async () => {
        const drawing = canvasRef.current.toDataURL('image/png');
        
        // Send the drawing to the backend
        const response = await fetch('https://merntest-1.onrender.com/api/drawings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ drawing }),  // Remove likes from here; the backend should set it to 0
        });
        
        const savedDrawing = await response.json();
        setDrawings((prevDrawings) => [savedDrawing, ...prevDrawings]);  // Add new drawing at the top
    };

    const handleLike = async (drawingId) => {
        const response = await fetch(`https://merntest-1.onrender.com/api/drawings/${drawingId}/like`, {
            method: 'POST',
        });
        const updatedDrawing = await response.json();

        setDrawings((prevDrawings) =>
            prevDrawings.map((drawing) =>
                drawing._id === drawingId ? { ...drawing, likes: updatedDrawing.likes } : drawing
            )
        );
    };

    return (
        <div className="drawing-container">
            <canvas
                ref={canvasRef}
                onMouseDown={(e) => setIsDrawing(true)}
                onMouseMove={(e) => isDrawing && /* draw logic */ {}}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                width={window.innerWidth < 500 ? window.innerWidth * 0.9 : 500}
                height={window.innerWidth < 500 ? window.innerWidth * 0.9 : 500}
                className="drawing-canvas"
            />
            <button onClick={saveDrawing}>Post</button>

            <div className="posted-drawings">
                {drawings.map((drawing, index) => (
                    <div key={drawing._id} className="drawing-item">
                        <img src={drawing.drawing} alt={`Drawing ${index + 1}`} />
                        <div className="like-section">
                            <button onClick={() => handleLike(drawing._id)}>
                                <FontAwesomeIcon icon={faHandSparkles} />
                            </button>
                            <span>{drawing.likes || 0}</span>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <p>Loading...</p>}
        </div>
    );
};

export default HomePage;
