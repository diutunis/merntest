import React, { useRef, useState, useEffect } from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles, faMicrophone, faStop, faUpload } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    const canvasRef = useRef(null);
    const offscreenCanvasRef = useRef(null);

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioURL, setAudioURL] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [drawings, setDrawings] = useState([]);

    useEffect(() => {
        const initCanvas = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = canvas.width;
            offscreenCanvas.height = canvas.height;
            offscreenCanvasRef.current = offscreenCanvas;
        };
        initCanvas();
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const audioChunks = [];

            recorder.ondataavailable = (event) => audioChunks.push(event.data);
            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                const url = URL.createObjectURL(audioBlob);
                setAudioBlob(audioBlob);
                setAudioURL(url);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const postAudioComment = async (drawingId) => {
        if (!audioBlob) return;

        const formData = new FormData();
        formData.append('audio', audioBlob, 'comment.mp3');

        try {
            const response = await fetch(`https://merntest-1.onrender.com/api/drawings/${drawingId}/comment`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                console.log('Audio comment posted successfully');
                setAudioBlob(null);
                setAudioURL('');
            } else {
                console.error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting audio comment:', error);
        }
    };

    return (
        <div className="drawing-container">
            <canvas ref={canvasRef} width={500} height={500} />

            <div className="controls">
                <button onClick={startRecording} disabled={isRecording}>
                    <FontAwesomeIcon icon={faMicrophone} /> Record
                </button>
                <button onClick={stopRecording} disabled={!isRecording}>
                    <FontAwesomeIcon icon={faStop} /> Stop
                </button>
                {audioURL && (
                    <audio controls>
                        <source src={audioURL} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                )}
            </div>

            <div className="posted-drawings">
                {drawings.map((drawing) => (
                    <div key={drawing._id} className="drawing-item">
                        <img src={drawing.drawing} alt="User Drawing" />
                        <button onClick={() => postAudioComment(drawing._id)}>
                            <FontAwesomeIcon icon={faUpload} /> Post Audio Comment
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
