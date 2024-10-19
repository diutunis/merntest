import React, { useRef, useState, useEffect } from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles, faMicrophone, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import 'audio-context-polyfill';

const HomePage = () => {
    const canvasRef = useRef(null);
    const offscreenCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawings, setDrawings] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const mediaRecorderRef = useRef(null);
    const [currentRecording, setCurrentRecording] = useState(null);
    const pageSize = 30;

    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [context, setContext] = useState(null);
    const [offscreenContext, setOffscreenContext] = useState(null);

    const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
    const joystickRadius = 70;
    const [isJoystickActive, setIsJoystickActive] = useState(false);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
            const newDrawings = Array.isArray(data) ? data : data.drawings || [];
            setDrawings((prev) => [...prev, ...newDrawings]);

            if (newDrawings.length < pageSize) setHasMore(false);
        } catch (error) {
            console.error('Error fetching drawings:', error);
        }
        setLoading(false);
    };

    useEffect(() => fetchDrawings(), [page]);

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                setRecording(true);

                mediaRecorder.ondataavailable = (event) => {
                    const audioBlob = new Blob([event.data], { type: 'audio/mpeg' });
                    const url = URL.createObjectURL(audioBlob);
                    setAudioURL(url);
                    setCurrentRecording(audioBlob);
                };

                mediaRecorder.onstop = () => setRecording(false);
            })
            .catch((error) => console.error('Error accessing microphone:', error));
    };

    const stopRecording = () => mediaRecorderRef.current?.stop();

    const handleAudioUpload = async (drawingId, audioFile) => {
        const formData = new FormData();
        formData.append('audio', audioFile);

        try {
            const response = await fetch(`https://merntest-1.onrender.com/api/drawings/${drawingId}/comments`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(await response.text());
            console.log('Audio uploaded successfully');
        } catch (error) {
            console.error('Error uploading audio:', error);
        }
    };

    const playAudio = async (audioURL) => {
        try {
            await audioContext.resume(); // Unlock audio context for Safari

            const audio = new Audio(audioURL);
            audio.crossOrigin = 'anonymous'; // Prevent CORS issues
            audio.playsInline = true; // Ensure mobile playback works
            await audio.play();
        } catch (error) {
            console.error('Audio playback error:', error);
        }
    };

    return (
        <div className="drawing-container">
            <canvas
                ref={canvasRef}
                onPointerDown={(e) => startDrawing(e)}
                onPointerMove={(e) => draw(e)}
                onPointerUp={(e) => stopDrawing(e)}
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
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                />

                <div
                    className="joystick"
                    style={{ width: joystickRadius * 2, height: joystickRadius * 2 }}
                    onPointerDown={() => setIsJoystickActive(true)}
                    onPointerUp={() => setIsJoystickActive(false)}
                >
                    <div
                        className="joystick-handle"
                        style={{
                            transform: `translate(${joystickPosition.x + joystickRadius - 15}px, 
                                         ${joystickPosition.y + joystickRadius - 15}px)`,
                        }}
                    />
                </div>
            </div>

            <button onClick={saveDrawing}>Post</button>
            <button onClick={clearCanvas}>Clear</button>

            <div className="posted-drawings">
                {drawings.map((drawing) => (
                    <div key={drawing._id} className="drawing-item">
                        <img src={drawing.drawing} alt="User drawing" />
                        <div className="like-section">
                            <button onClick={() => handleLike(drawing._id)}>
                                <FontAwesomeIcon icon={faHandSparkles} />
                            </button>
                            <span>{drawing.likes || 0}</span>
                        </div>

                        <div className="audio-section">
                            {recording ? (
                                <button onClick={stopRecording}>
                                    <FontAwesomeIcon icon={faStop} /> Stop
                                </button>
                            ) : (
                                <button onClick={startRecording}>
                                    <FontAwesomeIcon icon={faMicrophone} /> Record
                                </button>
                            )}

                            {audioURL && (
                                <>
                                    <button onClick={() => playAudio(audioURL)}>
                                        <FontAwesomeIcon icon={faPlay} /> Play
                                    </button>
                                    <button onClick={() => handleAudioUpload(drawing._id, currentRecording)}>
                                        Upload
                                    </button>
                                </>
                            )}

                            <div className="comments">
                                {drawing.comments?.map((comment, index) => (
                                    <div key={index} className="audio-comment">
                                        <button onClick={() => playAudio(comment.audioURL)}>
                                            <FontAwesomeIcon icon={faPlay} /> Play Comment
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
