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

    // Zoom and Pan states
    const [scale, setScale] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });

    // Function to fetch drawings with pagination
    const fetchDrawings = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(`https://merntest-1.onrender.com/api/drawings?page=${page}&limit=${pageSize}`);
            const data = await response.json();

            let newDrawings = Array.isArray(data) ? data : data.drawings || [];
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

    // Canvas drawing functionality
    const getPosition = (nativeEvent) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const event = nativeEvent.touches ? nativeEvent.touches[0] : nativeEvent; // Handle touch and mouse events
        const x = (event.clientX - rect.left - pan.x) / scale;
        const y = (event.clientY - rect.top - pan.y) / scale;
        return { x, y };
    };

    const startDrawing = (nativeEvent) => {
        nativeEvent.preventDefault(); // Prevent scrolling and other default actions
        setIsDrawing(true);
        const { x, y } = getPosition(nativeEvent);
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(x, y);
    };

    const draw = (nativeEvent) => {
        if (!isDrawing) return;
        nativeEvent.preventDefault(); // Prevent scrolling and other default actions
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

    // Slider for zoom control
    const handleZoomChange = (event) => {
        setScale(event.target.value);
    };

    // Joystick for panning
    const handlePanChange = (direction) => {
        const panAmount = 10; // Adjust pan amount as needed
        setPan((prev) => {
            switch (direction) {
                case 'up':
                    return { x: prev.x, y: prev.y + panAmount };
                case 'down':
                    return { x: prev.x, y: prev.y - panAmount };
                case 'left':
                    return { x: prev.x + panAmount, y: prev.y };
                case 'right':
                    return { x: prev.x - panAmount, y: prev.y };
                default:
                    return prev;
            }
        });
    };

    // Prevent scrolling when drawing
    const preventScroll = (e) => {
        if (isDrawing) {
            e.preventDefault();
        }
    };

 useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.lineWidth = 2; // Set line width
    context.lineCap = 'round'; // Set line cap style
    context.strokeStyle = 'black'; // Set default stroke color

    const resizeCanvas = () => {
        const aspectRatio = 1;
        canvas.width = window.innerWidth < 500 ? window.innerWidth * 0.9 : 500;
        canvas.height = canvas.width * aspectRatio;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Non-passive event listeners directly on the canvas
    const preventScroll = (e) => {
        if (isDrawing) {
            e.preventDefault();
        }
    };

    // Add the touchmove event listener as non-passive
    canvas.addEventListener('touchmove', preventScroll, { passive: false });
    canvas.addEventListener('wheel', preventScroll, { passive: false });

    return () => {
        window.removeEventListener('resize', resizeCanvas);
        canvas.removeEventListener('touchmove', preventScroll);
        canvas.removeEventListener('wheel', preventScroll);
    };
}, [isDrawing]);


    return (
        <div className="drawing-container">
            <div
                className="canvas-wrapper"
                style={{
                    overflow: 'hidden',
                    position: 'relative',
                    width: '500px',
                    height: '500px',
                }}
            >
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
                    style={{
                        border: '1px solid black',
                        width: '500px',
                        height: '500px',
                        transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
                        transformOrigin: 'top left',
                    }}
                />
            </div>
            <button onClick={saveDrawing}>Post</button>
            <button onClick={clearCanvas}>Clear</button>

            {/* Zoom Slider */}
            <div className="zoom-control">
                <label htmlFor="zoom-slider">Zoom: </label>
                <input
                    id="zoom-slider"
                    type="range"
                    min="1"
                    max="4"
                    step="0.1"
                    value={scale}
                    onChange={handleZoomChange}
                />
            </div>

            {/* Joystick for panning */}
            <div className="joystick-container">
                <button onClick={() => handlePanChange('up')}>↑</button>
                <button onClick={() => handlePanChange('left')}>←</button>
                <button onClick={() => handlePanChange('down')}>↓</button>
                <button onClick={() => handlePanChange('right')}>→</button>
            </div>

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

            {loading && <h4>Loading...</h4>}
        </div>
    );
};

export default HomePage;
