import React, { useRef, useState, useEffect } from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles } from '@fortawesome/free-solid-svg-icons';
import { ReactMediaRecorder } from 'react-media-recorder';






const HomePage = () => {
    const canvasRef = useRef(null);
    const offscreenCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawings, setDrawings] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 30;

    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [context, setContext] = useState(null);
    const [offscreenContext, setOffscreenContext] = useState(null);

    // Joystick state
    const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
    const joystickRadius = 70; // Radius of the joystick circle
    const [isJoystickActive, setIsJoystickActive] = useState(false); // Track joystick usage

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        setContext(ctx);

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        const offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCanvasRef.current = offscreenCanvas;
        setOffscreenContext(offscreenCtx);
    }, []);

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

    const getPosition = (nativeEvent) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (nativeEvent.clientX - rect.left - pan.x) / zoom;
        const y = (nativeEvent.clientY - rect.top - pan.y) / zoom;
        return { x, y };
    };

    const startDrawing = (nativeEvent) => {
        nativeEvent.preventDefault();
        setIsDrawing(true);
        const { x, y } = getPosition(nativeEvent);
        context.beginPath();
        context.moveTo(x, y);
        offscreenContext.beginPath();
        offscreenContext.moveTo(x, y);
    };

    const draw = (nativeEvent) => {
        if (!isDrawing) return;
        nativeEvent.preventDefault();
        const { x, y } = getPosition(nativeEvent);
        context.lineTo(x, y);
        context.stroke();

        offscreenContext.lineTo(x, y);
        offscreenContext.stroke();
    };

    const stopDrawing = (nativeEvent) => {
        if (!isDrawing) return;
        nativeEvent.preventDefault();
        setIsDrawing(false);
        context.closePath();
        offscreenContext.closePath();
    };

    const clearCanvas = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        offscreenContext.clearRect(0, 0, offscreenCanvasRef.current.width, offscreenCanvasRef.current.height);
    };

    const saveDrawing = async () => {
        const drawing = offscreenCanvasRef.current.toDataURL('image/png');
        const response = await fetch('https://merntest-1.onrender.com/api/drawings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
        if (isDrawing || isJoystickActive) {
            e.preventDefault();
        }
    };

    const handleMouseMove = (nativeEvent) => {
        if (isJoystickActive) {
            handleJoystickMove(nativeEvent);
        }
    };

    useEffect(() => {
        window.addEventListener('touchmove', preventScroll, { passive: false });
        window.addEventListener('wheel', preventScroll, { passive: false });
        return () => {
            window.removeEventListener('touchmove', preventScroll);
            window.removeEventListener('wheel', preventScroll);
        };
    }, [isDrawing, isJoystickActive]);

    const handleZoomChange = (e) => {
        const newZoom = parseFloat(e.target.value);
        applyTransformation(newZoom, pan);
        setZoom(newZoom);
    };

    const applyTransformation = (newZoom, newPan) => {
        context.setTransform(newZoom, 0, 0, newZoom, newPan.x, newPan.y);
        context.lineWidth = 1 / newZoom;
        redrawCanvas();
    };

    const redrawCanvas = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(offscreenCanvasRef.current, 0, 0);
    };

    // Handle joystick movement
    const handleJoystickMove = (nativeEvent) => {
        const rect = nativeEvent.currentTarget.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        let joystickX = nativeEvent.clientX - rect.left - centerX;
        let joystickY = nativeEvent.clientY - rect.top - centerY;

        const distance = Math.sqrt(joystickX ** 2 + joystickY ** 2);
        const angle = Math.atan2(joystickY, joystickX);

        // Limit joystick movement within the joystickRadius
        if (distance > joystickRadius) {
            joystickX = joystickRadius * Math.cos(angle);
            joystickY = joystickRadius * Math.sin(angle);
        }

        setJoystickPosition({ x: joystickX, y: joystickY });

        // Update pan based on joystick position
        setPan((prevPan) => ({
            x: prevPan.x - joystickX / 10,
            y: prevPan.y - joystickY / 10,
        }));
        
        // Apply transformation
        applyTransformation(zoom, {
            x: pan.x - joystickX / 10,
            y: pan.y - joystickY / 10,
        });
    };

    const startJoystick = () => {
        setIsJoystickActive(true); // Mark joystick as active
    };

    const stopJoystick = () => {
        // Reset joystick position to the center
        setJoystickPosition({ x: 0, y: 0 });
        // Optionally reset pan if desired
        // setPan({ x: 0, y: 0 }); 
        setIsJoystickActive(false); // Mark joystick as inactive
    };


const saveAudioComment = async (drawingId, mediaBlobUrl) => {
    const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
    const formData = new FormData();
    formData.append('audio', blob);
    
    try {
        const response = await fetch(`https://merntest-1.onrender.com/api/drawings/${drawingId}/comments`, {
            method: 'POST',
            body: formData
        });

        const updatedDrawing = await response.json();
        setDrawings((prevDrawings) =>
            prevDrawings.map((drawing) =>
                drawing._id === drawingId ? { ...drawing, comments: updatedDrawing.comments } : drawing
            )
        );
    } catch (error) {
        console.error('Error saving audio comment:', error);
    }
};




    return (
        <div className="drawing-container">
            <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
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
 className="zoom-slider"
                />

                {/* Joystick Area */}
                <div
                    className="joystick"
                    style={{
                        position: 'relative',
                        width: `${joystickRadius * 2}px`,
                        height: `${joystickRadius * 2}px`,
                        borderRadius: '50%',
                        backgroundColor: 'lightgray',
                        overflow: 'hidden',
                    }}
                    onPointerDown={startJoystick}
                    onPointerMove={handleMouseMove}
                    onPointerUp={stopJoystick}
                    onPointerLeave={stopJoystick}
                >
                    <div
                        className="joystick-handle"
                        style={{
                            position: 'absolute',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            backgroundColor: 'blue',
                            transform: `translate(${joystickPosition.x + joystickRadius - 15}px, ${joystickPosition.y + joystickRadius - 15}px)`,
                            transition: 'transform 0.1s',
                        }}
                    />
                </div>
            </div>

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

                        {/* Audio Comment Section */}
                        <div className="audio-comment-section">
                            <ReactMediaRecorder
                                audio
                                render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                                    <>
                                        <p>{status}</p>
                                        <button onClick={startRecording}>Start Recording</button>
                                        <button onClick={stopRecording}>Stop Recording</button>
                                        <audio src={mediaBlobUrl} controls />
                                        {mediaBlobUrl && (
                                            <button onClick={() => saveAudioComment(drawing._id, mediaBlobUrl)}>
                                                Post Audio Comment
                                            </button>
                                        )}
                                    </>
                                )}
                            />

                            {/* Display audio comments */}
                            <div className="audio-comments">
                                {drawing.comments?.map((comment, i) => (
                                    comment.type === 'audio' && (
                                        <div key={i}>
                                            <audio src={comment.audioUrl} controls />
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>



            {loading && <h4>Loading...</h4>}
        </div>
    );
};

export default HomePage;