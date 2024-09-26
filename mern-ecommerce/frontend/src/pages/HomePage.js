import React, { useRef, useState, useEffect } from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawings, setDrawings] = useState([]);
    const [page, setPage] = useState(1); // Track current page
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // To know when to stop fetching more drawings
    const pageSize = 30; // Define how many drawings to load per page

    // Function to fetch drawings with pagination
    const fetchDrawings = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(`https://merntest-1.onrender.com/api/drawings?page=${page}&limit=${pageSize}`);
            const data = await response.json();

            let newDrawings = [];
            if (Array.isArray(data)) {
                newDrawings = data;
            } else if (typeof data === 'object' && data.drawings) {
                newDrawings = data.drawings;
            } else {
                console.error("Unexpected data format:", data);
                return;
            }

            // Add new drawings to the existing ones
            setDrawings((prevDrawings) => [...prevDrawings, ...newDrawings]);

            // If fewer drawings than expected were returned, stop fetching more
            if (newDrawings.length < pageSize) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching drawings:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDrawings();
    }, [page]); // Fetch drawings every time the page number increments

    // Load more drawings when scrolling reaches the bottom
    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
            setPage((prevPage) => prevPage + 1); // Increment the page number
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    // Canvas drawing functionality (same as before)
    const getPosition = (nativeEvent) => {
        const rect = canvasRef.current.getBoundingClientRect();
        if (nativeEvent.touches) {
            const touch = nativeEvent.touches[0];
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        }
        return { x: nativeEvent.offsetX, y: nativeEvent.offsetY };
    };

    const startDrawing = (nativeEvent) => {
        nativeEvent.preventDefault();
        setIsDrawing(true);
        const { x, y } = getPosition(nativeEvent);
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(x, y);
    };

    const draw = (nativeEvent) => {
        nativeEvent.preventDefault();
        if (!isDrawing) return;
        const { x, y } = getPosition(nativeEvent);
        const context = canvasRef.current.getContext('2d');
        context.lineTo(x, y);
        context.stroke();
    };

    const stopDrawing = (nativeEvent) => {
        nativeEvent.preventDefault();
        if (!isDrawing) return;
        setIsDrawing(false);
        const context = canvasRef.current.getContext('2d');
        context.closePath();
    };

    const clearCanvas = () => {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const saveDrawing = async () => {
        const drawing = canvasRef.current.toDataURL('image/png');
        
        const response = await fetch('https://merntest-1.onrender.com/api/drawings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ drawing }),
        });
        
        const savedDrawing = await response.json();
        setDrawings((prevDrawings) => [savedDrawing, ...prevDrawings]);
        clearCanvas();
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

    // Disable scroll while drawing
    const preventScroll = (e) => {
        if (isDrawing) {
            e.preventDefault();
        }
    };

    useEffect(() => {
        // Prevent scroll on touchmove and mousewheel events when drawing
        window.addEventListener('touchmove', preventScroll, { passive: false });
        window.addEventListener('wheel', preventScroll, { passive: false });

        return () => {
            window.removeEventListener('touchmove', preventScroll);
            window.removeEventListener('wheel', preventScroll);
        };
    }, [isDrawing]);

    return (
        <div className="drawing-container">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="drawing-canvas"
                width={window.innerWidth < 500 ? window.innerWidth * 0.9 : 500}
                height={window.innerWidth < 500 ? window.innerWidth * 0.9 : 500}
            />
            <button onClick={saveDrawing}>Post</button>
            <button onClick={clearCanvas}>Clear</button>

            <div className="posted-drawings">
                {drawings.map((drawing, index) => (
                    <div key={drawing._id} className="drawing-item">
                        <img src={drawing.drawing} alt={`User drawing ${index + 1}`} />
                        <div className="like-section">
                            <button onClick={() => handleLike(drawing._id)}><FontAwesomeIcon icon={faHandSparkles} /></button>
                            <span>{drawing.likes || 0}</span>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <h4>Loading more drawings...</h4>}
        </div>
    );
};

export default HomePage;
