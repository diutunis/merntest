import React, { useRef, useState, useEffect } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import './HomePage.css';
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
                        width: ${joystickRadius * 2}px,
                        height: ${joystickRadius * 2}px,
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
                            transform: translate(${joystickPosition.x + joystickRadius - 15}px, ${joystickPosition.y + joystickRadius - 15}px),
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

                        {/* Audio Recorder */}
                        <div className="audio-recorder">
                            <ReactMediaRecorder
                                audio
                                render={({ startRecording, stopRecording, mediaBlobUrl }) => (
                                    <div>
                                        <button onClick={startRecording}>
                                            <FontAwesomeIcon icon={faMicrophone} /> Start Recording
                                        </button>
                                        <button onClick={stopRecording}>
                                            <FontAwesomeIcon icon={faStop} /> Stop Recording
                                        </button>
                                        {mediaBlobUrl && (
                                            <div>
                                                <audio src={mediaBlobUrl} controls />
                                                <button
                                                    onClick={() => handleAudioUpload(mediaBlobUrl, drawing._id)}
                                                >
                                                    <FontAwesomeIcon icon={faUpload} /> Upload
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {loading && <h4>Loading...</h4>}
        </div>
    );
};

export default HomePage;
