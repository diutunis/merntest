import React, { useState, useEffect } from 'react';

const AudioRecorder = ({ onSave, drawingId }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize audio context on user interaction
    const initializeAudio = async () => {
      try {
        // Create AudioContext - needed for iOS
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        await audioContext.resume();

        // Request permissions
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });

        // Create MediaRecorder instance
        const recorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setChunks(prev => [...prev, e.data]);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        };

        setMediaRecorder(recorder);
        setPermissionGranted(true);
        setError(null);
      } catch (err) {
        console.error('Error initializing audio:', err);
        setError('Please grant microphone permissions to record audio');
      }
    };

    // Don't automatically initialize - wait for user interaction
    const setupButton = document.createElement('button');
    setupButton.style.display = 'none';
    document.body.appendChild(setupButton);
    setupButton.addEventListener('click', initializeAudio);
    
    return () => {
      setupButton.removeEventListener('click', initializeAudio);
      document.body.removeChild(setupButton);
    };
  }, []);

  const startRecording = async () => {
    try {
      setChunks([]);
      setAudioUrl(null);
      mediaRecorder.start(10);
      setRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Error starting recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleSave = async () => {
    if (!audioUrl) return;

    try {
      const blob = await fetch(audioUrl).then(r => r.blob());
      await onSave(drawingId, blob);
      setAudioUrl(null);
      setChunks([]);
    } catch (err) {
      console.error('Error saving audio:', err);
      setError('Error saving audio comment');
    }
  };

  return (
    <div className="audio-recorder">
      {error && <div className="error-message">{error}</div>}
      
      <div className="recorder-controls">
        {!permissionGranted ? (
          <button 
            onClick={() => document.querySelector('button[style="display: none;"]').click()}
            className="setup-button"
          >
            Setup Audio Recording
          </button>
        ) : (
          <>
            <button 
              onClick={recording ? stopRecording : startRecording}
              className={recording ? 'recording' : ''}
            >
              {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
            
            {audioUrl && (
              <div className="audio-preview">
                <audio src={audioUrl} controls />
                <button onClick={handleSave}>Save Comment</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;