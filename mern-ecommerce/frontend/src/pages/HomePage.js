import React, { useRef, useState, useEffect } from 'react';
import './HomePage.css';
import { ReactMediaRecorder } from 'react-media-recorder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles, faMicrophone, faStop, faUpload } from '@fortawesome/free-solid-svg-icons';

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

    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [currentAudioComment, setCurrentAudioComment] = useState(null); // To save the audio comment for each drawing

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

    const handleAudioUpload = async (audioBlob, drawingId) => {
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
            const response = await fetch(`https://merntest-1.onrender.com/api/drawings/${drawingId}/comments`, {
                method: 'POST',
                body: formData,
            });
            const savedComment = await response.json();
            setDrawings((prevDrawings) =>
                prevDrawings.map((drawing) =>
                    drawing._id === drawingId ? { ...drawing, comments: [...drawing.comments, savedComment] } : drawing
                )
            );
        } catch (error) {
            console.error('Error uploading audio comment:', error);
        }
    };

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
        const panSpeed = 2; // Adjust for desired panning sensitivity
        setPan((prevPan) => ({
            x: prevPan.x - joystickX * panSpeed,
            y: prevPan.y - joystickY * panSpeed,
        }));
        applyTransformation(zoom, { x: pan.x - joystickX * panSpeed, y: pan.y - joystickY * panSpeed });
    };

    const handleJoystickRelease = () => {
        setIsJoystickActive(false);
        setJoystickPosition({ x: 0, y: 0 }); // Reset joystick to center
    };

    return (
        <div>
            <h1></h1>
            <div className="canvas-container">
                <canvas
                    ref={canvasRef}
                    width="800"
                    height="600"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
                <div
                    className="joystick-container"
                    onMouseDown={() => setIsJoystickActive(true)}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleJoystickRelease}
                    onMouseLeave={handleJoystickRelease}
                >
                    <div
                        className="joystick-handle"
                        style={{
                            transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
                        }}
                    />
                </div>
            </div>
            <button onClick={saveDrawing}>Save Drawing</button>
            <div className="zoom-controls">
                <label>Zoom: </label>
                <input type="range" min="0.5" max="2" step="0.1" value={zoom} onChange={handleZoomChange} />
            </div>
            <div className="drawing-gallery">
                {drawings.map((drawing) => (
                    <div key={drawing._id} className="drawing-item">
                        <img src={drawing.image} alt="Drawing" />
                        <button onClick={() => handleLike(drawing._id)}>
                            <FontAwesomeIcon icon={faHandSparkles} /> {drawing.likes}
                        </button>
                        <ReactMediaRecorder
                            audio
                            render={({ startRecording, stopRecording, mediaBlobUrl }) => (
                                <div className="audio-recorder">
                                    <button onClick={startRecording}><FontAwesomeIcon icon={faMicrophone} /></button>
                                    <button onClick={stopRecording}><FontAwesomeIcon icon={faStop} /></button>
                                    {mediaBlobUrl && (
                                        <button
                                            onClick={() => {
                                                handleAudioUpload(mediaBlobUrl, drawing._id);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faUpload} />
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        {drawing.comments.map((comment, index) => (
                            <audio key={index} src={comment.audioURL} controls />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
