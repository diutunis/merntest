import React, { useRef, useState, useEffect } from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawings, setDrawings] = useState([]);
    const [page, setPage] = useState(1); // For pagination
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // If more drawings can be fetched

    const pageSize = 30; // Number of drawings per page

    useEffect(() => {
        // Fetch initial set of drawings
        fetchDrawings(page);

        // Disable page scrolling when the user is drawing on the canvas
        const disableScroll = (e) => {
            if (isDrawing && canvasRef.current && canvasRef.current.contains(e.target)) {
                e.preventDefault();
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.body.addEventListener('touchmove', disableScroll, { passive: false });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.removeEventListener('touchmove', disableScroll);
        };
    }, [isDrawing, page]);

   const fetchDrawings = async (pageNumber) => {
    setLoading(true);
    try {
        const response = await fetch(`https://merntest-1.onrender.com/api/drawings?page=${pageNumber}&limit=${pageSize}`);
        const data = await response.json();

        let newDrawings = [];
        
        // Check if data is an array or an object
        if (Array.isArray(data)) {
            newDrawings = data;
        } else if (typeof data === 'object' && data.drawings) {
            // If data is an object, extract the drawings from the `drawings` field
            newDrawings = data.drawings;
        } else {
            console.error("Unexpected data format:", data);
            return;
        }

        // Reverse and append new drawings to the state
        setDrawings((prevDrawings) => [...prevDrawings, ...newDrawings.reverse()]);

        // If the number of new drawings is less than pageSize, assume no more drawings
        if (newDrawings.length < pageSize) {
            setHasMore(false);
        }
    } catch (error) {
        console.error('Error fetching drawings:', error);
    }
    setLoading(false);
};


    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 2 && hasMore && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const getPosition = (nativeEvent) => {
        const rect = canvasRef.current.getBoundingClientRect();
        if (nativeEvent.touches) {
            const touch = nativeEvent.touches[0];
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        }
        return { x: nativeEvent.clientX - rect.left, y: nativeEvent.clientY - rect.top };
    };

    const startDrawing = (nativeEvent) => {
        nativeEvent.preventDefault(); // Prevent scroll on canvas interaction
        const { x, y } = getPosition(nativeEvent);
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (nativeEvent) => {
        nativeEvent.preventDefault(); // Prevent scroll on canvas interaction
        if (!isDrawing) return;
        const { x, y } = getPosition(nativeEvent);
        const context = canvasRef.current.getContext('2d');
        context.lineTo(x, y);
        context.stroke();
    };

    const stopDrawing = () => {
        const context = canvasRef.current.getContext('2d');
        context.closePath();
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const saveDrawing = async () => {
        const drawing = canvasRef.current.toDataURL('image/png');

        // Send drawing to backend
        const response = await fetch('https://merntest-1.onrender.com/api/drawings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ drawing }),
        });

        const savedDrawing = await response.json();
        setDrawings((prevDrawings) => [savedDrawing, ...prevDrawings]); // Add new drawing at the top
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
                            <button onClick={() => handleLike(drawing._id)}>
                                <FontAwesomeIcon icon={faHandSparkles} />
                            </button>
                            <span>{drawing.likes || 0}</span>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <div>Loading more drawings...</div>}
        </div>
    );
};

export default HomePage;
