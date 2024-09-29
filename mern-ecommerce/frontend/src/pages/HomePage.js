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

    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [context, setContext] = useState(null);
    const [lines, setLines] = useState([]); // Store drawn lines

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        setContext(ctx);
    }, []);

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

    // Get mouse/touch position
    const getPosition = (nativeEvent) => {
        const rect = canvasRef.current.getBoundingClientRect();
        if (nativeEvent.touches && nativeEvent.touches.length > 0) {
            const touch = nativeEvent.touches[0];
            return { x: (touch.clientX - rect.left - pan.x) / zoom, y: (touch.clientY - rect.top - pan.y) / zoom };
        } else {
            return { x: (nativeEvent.clientX - rect.left - pan.x) / zoom, y: (nativeEvent.clientY - rect.top - pan.y) / zoom };
        }
    };

    // Start drawing
    const startDrawing = (nativeEvent) => {
        nativeEvent.preventDefault();
        setIsDrawing(true);
        const { x, y } = getPosition(nativeEvent);
        setLines((prevLines) => [...prevLines, [{ x, y }]]);
    };

    // Draw on canvas
    const draw = (nativeEvent) => {
        if (!isDrawing) return;
        nativeEvent.preventDefault();
        const { x, y } = getPosition(nativeEvent);
        setLines((prevLines) => {
            const newLines = [...prevLines];
            const lastLine = newLines[newLines.length - 1];
            lastLine.push({ x, y });
            return newLines;
        });
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    // Clear canvas
    const clearCanvas = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setLines([]);
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

    // Prevent page scroll while drawing
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

    // Handle zoom change
    const handleZoomChange = (e) => {
        const newZoom = parseFloat(e.target.value);
        setZoom(newZoom);
        redrawCanvas(newZoom, pan);
    };

    // Handle pan
    const handlePan = (direction) => {
        const panStep = 10;
        let newPan = { ...pan };

        switch (direction) {
            case 'up':
                newPan.y -= panStep;
                break;
            case 'down':
                newPan.y += panStep;
                break;
            case 'left':
                newPan.x -= panStep;
                break;
            case 'right':
                newPan.x += panStep;
                break;
            default:
                break;
        }

        setPan(newPan);
        redrawCanvas(zoom, newPan);
    };

    // Redraw the entire canvas when zooming or panning
    const redrawCanvas = (newZoom, newPan) => {
        context.save();
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.setTransform(newZoom, 0, 0, newZoom, newPan.x, newPan.y);

        // Redraw all the lines
        lines.forEach(line => {
            context.beginPath();
            context.moveTo(line[0].x, line[0].y);
            for (let i = 1; i < line.length; i++) {
                context.lineTo(line[i].x, line[i].y);
            }
            context.stroke();
        });

        context.restore();
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
                width={500}
                height={500}
            />
            <div className="controls">
                <label htmlFor="zoom">Zoom: {zoom}</label>
                <input
                    type="range"
                    id="zoom"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={handleZoomChange}
                />

                <div className="joystick">
                    <button onClick={() => handlePan('up')}>↑</button>
                    <div>
                        <button onClick={() => handlePan('left')}>←</button>
                        <button onClick={() => handlePan('right')}>→</button>
                    </div>
                    <button onClick={() => handlePan('down')}>↓</button>
                </div>
            </div>

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
