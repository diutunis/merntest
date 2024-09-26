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
    const [scale, setScale] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
    const [zoomMode, setZoomMode] = useState(false);

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

    const getPosition = (nativeEvent) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: nativeEvent.clientX - rect.left - pan.x,
            y: nativeEvent.clientY - rect.top - pan.y
        };
    };

    const startDrawing = (nativeEvent) => {
        if (zoomMode) return;
        nativeEvent.preventDefault();
        const { x, y } = getPosition(nativeEvent);
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (nativeEvent) => {
        if (zoomMode) return;
        nativeEvent.preventDefault();
        if (!isDrawing) return;
        const { x, y } = getPosition(nativeEvent);
        const context = canvasRef.current.getContext('2d');
        context.lineTo(x, y);
        context.stroke();
    };

    const stopDrawing = (nativeEvent) => {
        if (zoomMode) return;
        nativeEvent.preventDefault();
        if (!isDrawing) return;
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

    const handleWheel = (event) => {
        if (!zoomMode) return;
        event.preventDefault();
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        setScale((prevScale) => Math.max(0.5, Math.min(prevScale * zoomFactor, 4)));
    };

    const toggleZoomMode = () => {
        setZoomMode(!zoomMode);
    };

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
                y: prevPan.y + (event.clientY - startPanPosition.y)
            }));
            setStartPanPosition({ x: event.clientX, y: event.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
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
                onWheel={handleWheel}
                onMouseDownCapture={handleMouseDown}
                onMouseMoveCapture={handleMouseMove}
                onMouseUpCapture={handleMouseUp}
                className="drawing-canvas"
                width={500}
                height={500}
                style={{
                    transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
                    transition: 'transform 0.1s',
                }}
            />
            <div className="control-buttons">
                <button onClick={saveDrawing}>Post</button>
                <button onClick={clearCanvas}>Clear</button>
                <button onClick={toggleZoomMode}>
                    {zoomMode ? 'Disable Zoom' : 'Enable Zoom'}
                </button>
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

            {loading && <h4>Loading more drawings...</h4>}
        </div>
    );
};

export default HomePage;
