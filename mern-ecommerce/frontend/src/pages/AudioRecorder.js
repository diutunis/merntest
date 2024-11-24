import React, { useState } from 'react';

const AudioRecorder = ({ drawingId, onSave }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setAudioBlob(event.data);
                }
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (err) {
            console.error('Error starting recording:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const saveAudio = () => {
        if (audioBlob) {
            onSave(drawingId, audioBlob);
            setAudioBlob(null); // Reset the audio blob
        }
    };

    return (
        <div className="audio-recorder">
            {!isRecording ? (
                <button onClick={startRecording}>Start Recording</button>
            ) : (
                <button onClick={stopRecording}>Stop Recording</button>
            )}
            {audioBlob && (
                <div>
                    <audio src={URL.createObjectURL(audioBlob)} controls />
                    <button onClick={saveAudio}>Save Comment</button>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
