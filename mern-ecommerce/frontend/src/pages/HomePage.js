import React, { useRef, useState, useEffect } from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles, faMicrophone, faStop, faUpload } from '@fortawesome/free-solid-svg-icons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const HomePage = () => {
    const canvasRef = useRef(null);
    const offscreenCanvasRef = useRef(null);
    const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

    const [isDrawing, setIsDrawing] = useState(false);
    const [drawings, setDrawings] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Audio recording state
    const [isRecording, setIsRecording] = useState(false);
    const [recordedFilePath, setRecordedFilePath] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioComment, setAudioComment] = useState(null);

    const pageSize = 30;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        const offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCanvasRef.current = offscreenCanvas;
    }, []);

    const fetchDrawings = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await fetch(`https://merntest-1.onrender.com/api/drawings?page=${page}&limit=${pageSize}`);
            const data = await response.json();
            setDrawings((prevDrawings) => [...prevDrawings, ...(data.drawings || [])]);
            if (data.length < pageSize) setHasMore(false);
        } catch (error) {
            console.error('Error fetching drawings:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDrawings();
    }, [page]);

    // Handle audio recording start
    const startRecording = async () => {
        try {
            const result = await audioRecorderPlayer.startRecorder();
            setIsRecording(true);
            console.log('Recording started: ', result);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    // Handle audio recording stop
    const stopRecording = async () => {
        try {
            const result = await audioRecorderPlayer.stopRecorder();
            setRecordedFilePath(result);
            setIsRecording(false);
            console.log('Recording stopped, file saved at: ', result);
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    };

    // Handle audio playback
    const playAudio = async (path) => {
        try {
            await audioRecorderPlayer.startPlayer(path);
            setIsPlaying(true);
            audioRecorderPlayer.addPlayBackListener((e) => {
                if (e.currentPosition === e.duration) {
                    audioRecorderPlayer.stopPlayer();
                    setIsPlaying(false);
                }
            });
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const postCommentWithAudio = async (drawingId) => {
        if (!recordedFilePath) return;

        const formData = new FormData();
        formData.append('audio', {
            uri: recordedFilePath,
            type: 'audio/mp4',
            name: 'comment.mp4',
        });

        try {
            const response = await fetch(`https://merntest-1.onrender.com/api/drawings/${drawingId}/comment`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                console.log('Audio comment posted successfully');
                setRecordedFilePath(''); // Reset the audio path
            } else {
                console.error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    return (
        <div className="drawing-container">
            <canvas
                ref={canvasRef}
                onPointerDown={(e) => setIsDrawing(true)}
                onPointerMove={(e) => setIsDrawing(isDrawing)}
                onPointerUp={(e) => setIsDrawing(false)}
                width={500}
                height={500}
            />
            <div className="controls">
                <button onClick={startRecording} disabled={isRecording}>
                    <FontAwesomeIcon icon={faMicrophone} /> Record
                </button>
                <button onClick={stopRecording} disabled={!isRecording}>
                    <FontAwesomeIcon icon={faStop} /> Stop
                </button>
                {recordedFilePath && (
                    <button onClick={() => playAudio(recordedFilePath)}>
                        <FontAwesomeIcon icon={faUpload} /> Play
                    </button>
                )}
            </div>

            <div className="posted-drawings">
                {drawings.map((drawing) => (
                    <div key={drawing._id} className="drawing-item">
                        <img src={drawing.drawing} alt="User Drawing" />
                        <button onClick={() => postCommentWithAudio(drawing._id)}>Post Audio Comment</button>
                    </div>
                ))}
            </div>

            {loading && <h4>Loading...</h4>}
        </div>
    );
};

export default HomePage;
