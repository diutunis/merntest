import React, { useRef, useState, useEffect } from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawings, setDrawings] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 30;

    const [scale, setScale] = useState(1); // For zoom level
    const [lastDistance, setLastDistance] = useState(null); // Pinch zoom distance
    const [isPinching, setIsPinching] = useState(false); // To know if a pinch-zoom is occurring

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

            setDrawings((prevDrawings) => [...prevDrawings, ...newDrawings]);

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
    }, [page]);

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    // Get the position on the canvas (mouse or touch)
    const getPosition = (nativeEvent) => {
        const rect = canvasRef.current.getBoundingClientRect();
        if (nativeEvent.touches && nativeEvent.touches.length === 1) {
            const touch = nativeEvent.touches[0];
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        } else if (!nativeEvent.touches) {
            return { x: nativeEvent.clientX - rect.left, y: nativeEvent.clientY - rect.top };
        }
    };

    const startDrawing = (nativeEvent) => {
        // Prevent drawing during pinch-zoom
        if (nativeEvent.touches && nativeEvent.touches.length > 1) return;
        nativeEvent.preventDefault();
        setIsDrawing(true);
        const { x, y } = getPosition(nativeEvent);
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(x, y);
    };

    const draw = (nativeEvent) => {
        if (!isDrawing || (nativeEvent.touches && nativeEvent.touches.length > 1)) return; 
        nativeEvent.preventDefault();
        const { x, y } = getPosition(nativeEvent);
        const context = canvasRef.current.getContext('2d');
        context.lineTo(x, y);
        context.stroke();
    };

    const stopDrawing = (nativeEvent) => {
        if (!isDrawing) return;
        nativeEvent.preventDefault();
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

    // Pinch to zoom functionality
    const handlePinchStart = (e) => {
        if (e.touches.length === 2) {
            const distance = getDistanceBetweenTouches(e.touches);
            setLastDistance(distance);
            setIsPinching(true); // Indicate pinch gesture is in progress
        }
    };

    const handlePinchMove = (e) => {
        if (e.touches.length === 2 && lastDistance !== null) {
            const distance = getDistanceBetweenTouches(e.touches);
            const scaleFactor = distance / lastDistance;

            setScale((prevScale) => Math.min(Math.max(prevScale * scaleFactor, 0.5), 4)); // Zoom between 0.5x and 4x
            setLastDistance(distance);
        }
    };

    const handlePinchEnd = () => {
        setIsPinching(false);
        setLastDistance(null);
    };

    const getDistanceBetweenTouches = (touches) => {
        const touch1 = touches[0];
        const touch2 = touches[1];
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    return (
        <div className="drawing-container">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={(e) => isPinching ? handlePinchStart(e) : startDrawing(e)} // Only start drawing if not pinching
                onTouchMove={(e) => isPinching ? handlePinchMove(e) : draw(e)}
                onTouchEnd={(e) => isPinching ? handlePinchEnd() : stopDrawing(e)}
                className="drawing-canvas"
                width={window.innerWidth < 500 ? window.innerWidth * 0.9 : 500}
                height={window.innerWidth < 500 ? window.innerWidth * 0.9 : 500}
                style={{ transform: `scale(${scale})` }} // Apply zoom scale
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

            {loading && <h4>Loading...</h4>}
        </div>
    );
};

export default HomePage;
