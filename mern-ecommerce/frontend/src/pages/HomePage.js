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

    // Zoom and Pan state
    const [scale, setScale] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [zoomMode, setZoomMode] = useState(false);
    const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });

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

    // Load more drawings when scrolling reaches the bottom
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
        const x = (nativeEvent.clientX - rect.left - pan.x) / scale;
        const y = (nativeEvent.clientY - rect.top - pan.y) / scale;
        return { x, y };
    };

    const startDrawing = (nativeEvent) => {
        if (zoomMode) return;
        nativeEvent.preventDefault();
        setIsDrawing(true);
        const { x, y } = getPosition(nativeEvent);
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(x, y);
    };

    const draw = (nativeEvent) => {
        if (!isDrawing || zoomMode) return;
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

    const preventScroll = (e) => {
        if (isDrawing) {
            e.preventDefault();
        }
    };

    useEffect(() => {
        window.addEventListener('touchmove', preventScroll, { passive: false });
        window.addEventListener('wheel', preventScroll, { passive: false });
        return () => {
            window.removeEventListener('touchmove', preventScroll);
            window.removeEventListener('wheel', preventScroll);
        };
    }, [isDrawing]);

    // Zoom and pan handlers
    const handleMouseDown = (event) => {
        if (zoomMode) {
            setIsPanning(true);
            setStartPanPosition({ x: event.clientX, y: event.clientY });
        }
    };

    const handleMouseMove = (event) => {
        if (isPanning) {
            setPan((prevPan) => ({
                x: prevPan.x + (event.clientX - startPanPosition.x),
                y: prevPan.y + (event.clientY - startPanPosition.y),
            }));
            setStartPanPosition({ x: event.clientX, y: event.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleTouchStart = (event) => {
        if (zoomMode) {
            setIsPanning(true);
            const touch = event.touches[0];
            setStartPanPosition({ x: touch.clientX, y: touch.clientY });
        }
    };

    const handleTouchMove = (event) => {
        if (isPanning) {
            const touch = event.touches[0];
            setPan((prevPan) => ({
                x: prevPan.x + (touch.clientX - startPanPosition.x),
                y: prevPan.y + (touch.clientY - startPanPosition.y),
            }));
            setStartPanPosition({ x: touch.clientX, y: touch.clientY });
            event.preventDefault();
        }
    };

    const handleTouchEnd = () => {
        setIsPanning(false);
    };

    const toggleZoomMode = () => {
        setZoomMode((prev) => !prev);
        if (zoomMode) {
            setPan({ x: 0, y: 0 }); // Reset pan when disabling zoom
            setScale(1); // Reset scale when disabling zoom
        }
    };

    const handleWheel = (event) => {
        if (!zoomMode) return; // Only zoom in zoom mode
        event.preventDefault();
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        setScale((prevScale) => Math.max(0.5, Math.min(prevScale * zoomFactor, 4)));
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
                onMouseDownCapture={handleMouseDown}
                onMouseMoveCapture={handleMouseMove}
                onMouseUpCapture={handleMouseUp}
                onTouchStartCapture={handleTouchStart}
                onTouchMoveCapture={handleTouchMove}
                onTouchEndCapture={handleTouchEnd}
                onWheel={handleWheel}
                className="drawing-canvas"
                width={500}
                height={500}
                style={{
                    border: '1px solid black',
                    transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.1s',
                }}
            />
            <button onClick={saveDrawing}>Post</button>
            <button onClick={clearCanvas}>Clear</button>
            <button onClick={toggleZoomMode}>{zoomMode ? 'Disable Zoom' : 'Enable Zoom'}</button>

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
