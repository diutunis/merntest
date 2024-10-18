import React, { useRef, useState, useEffect } from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles, faMicrophone, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    const canvasRef = useRef(null);
    const [drawings, setDrawings] = useState([]);
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const mediaRecorderRef = useRef(null);
    const [currentRecording, setCurrentRecording] = useState(null);

    // ... (Keep existing state and useEffects)

    const handleLike = async (drawingId) => {
        // Like functionality remains the same
    };

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                setRecording(true);

                mediaRecorder.ondataavailable = (event) => {
                    const audioBlob = new Blob([event.data], { type: 'audio/wav' });
                    const url = URL.createObjectURL(audioBlob);
                    setAudioURL(url);
                    setCurrentRecording(audioBlob);
                };

                mediaRecorder.onstop = () => {
                    setRecording(false);
                };
            })
            .catch((error) => console.error('Error accessing microphone:', error));
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
    };

    const uploadAudio = async (drawingId) => {
        if (!currentRecording) return;
        const formData = new FormData();
        formData.append('audio', currentRecording);

        try {
            const response = await fetch(`https://merntest-1.onrender.com/api/drawings/${drawingId}/comments`, {
                method: 'POST',
                body: formData,
            });
            const updatedDrawing = await response.json();

            setDrawings((prevDrawings) =>
                prevDrawings.map((drawing) =>
                    drawing._id === drawingId ? { ...drawing, comments: updatedDrawing.comments } : drawing
                )
            );
            setAudioURL(null); // Reset audio after upload
        } catch (error) {
            console.error('Error uploading audio:', error);
        }
    };

    return (
        <div className="drawing-container">
            <canvas ref={canvasRef} className="drawing-canvas" width={500} height={500} />

            {/* Other controls (Zoom, Joystick, etc.) */}

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

                        {/* Audio Recording and Playback Section */}
                        <div className="audio-section">
                            {recording ? (
                                <button onClick={stopRecording}>
                                    <FontAwesomeIcon icon={faStop} /> Stop Recording
                                </button>
                            ) : (
                                <button onClick={startRecording}>
                                    <FontAwesomeIcon icon={faMicrophone} /> Record Audio
                                </button>
                            )}

                            {audioURL && (
                                <>
                                    <audio controls src={audioURL}></audio>
                                    <button onClick={() => uploadAudio(drawing._id)}>Upload Audio</button>
                                </>
                            )}

                            <div className="comments">
                                {drawing.comments?.map((comment, index) => (
                                    <div key={index} className="audio-comment">
                                        <audio controls src={comment.audioURL}></audio>
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
