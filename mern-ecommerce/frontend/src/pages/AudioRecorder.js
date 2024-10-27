import React, { useState, useEffect } from 'react';

const AudioIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const StopIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2">
    <rect x="6" y="6" width="12" height="12"/>
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2">
    <polygon points="5 3 19 12 5 21"/>
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2">
    <line x1="8" y1="5" x2="8" y2="19"/>
    <line x1="16" y1="5" x2="16" y2="19"/>
  </svg>
);

const AudioRecorder = ({ onSave, drawingId }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const initializeAudio = async () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      await audioContext.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setChunks(prev => [...prev, e.data]);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      setMediaRecorder(recorder);
      setPermissionGranted(true);
      setError(null);
    } catch (err) {
      setError('Please grant microphone permissions to record audio');
    }
  };

  const startRecording = async () => {
    try {
      setChunks([]);
      setAudioUrl(null);
      mediaRecorder.start(10);
      setRecording(true);
      setDuration(0);
      const startTime = Date.now();
      const newTimer = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      setTimer(newTimer);
    } catch (err) {
      setError('Error starting recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      if (timer) clearInterval(timer);
    }
  };

  const handleSave = async () => {
    if (!audioUrl) return;
    try {
      const blob = await fetch(audioUrl).then(r => r.blob());
      await onSave(drawingId, blob);
      setAudioUrl(null);
      setChunks([]);
      setDuration(0);
    } catch (err) {
      setError('Error saving audio comment');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 bg-gray-50 rounded">
      {error && (
        <div className="text-red-500 mb-4 p-2 bg-red-50 rounded text-sm">
          {error}
        </div>
      )}
      
      <div className="flex items-center gap-4">
        {!permissionGranted ? (
          <button 
            onClick={initializeAudio}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <AudioIcon />
            <span>Setup Recording</span>
          </button>
        ) : (
          <div className="flex items-center gap-4">
            {recording ? (
              <button 
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                style={{ animation: 'pulse 2s infinite' }}
              >
                <StopIcon />
                <span>Stop</span>
              </button>
            ) : (
              <button 
                onClick={startRecording}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <AudioIcon />
                <span>Record</span>
              </button>
            )}
            
            {recording && (
              <div className="text-red-500">
                Recording: {formatTime(duration)}
              </div>
            )}
          </div>
        )}
      </div>

      {audioUrl && (
        <div className="mt-4">
          <audio src={audioUrl} controls className="w-full mb-4" />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Comment
            </button>
            <button
              onClick={() => {
                setAudioUrl(null);
                setChunks([]);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AudioCommentPlayer = ({ comment }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = React.useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(progress);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
      <button
        onClick={togglePlay}
        className="p-2 bg-white rounded-full hover:bg-gray-200"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <audio
        ref={audioRef}
        src={comment.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
};

const AudioSection = ({ drawingId, onSave, comments }) => {
  return (
    <div className="space-y-4">
      <AudioRecorder drawingId={drawingId} onSave={onSave} />
      
      {comments?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Audio Comments</h3>
          {comments.map((comment, index) => (
            comment.type === 'audio' && (
              <AudioCommentPlayer key={index} comment={comment} />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioSection;