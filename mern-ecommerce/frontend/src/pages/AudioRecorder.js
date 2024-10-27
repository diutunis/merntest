import React, { useState, useEffect } from 'react';
import { Mic, Square, Play, Pause, Save, Trash2, Volume2, Clock } from 'lucide-react';

const AudioRecorder = ({ onSave, drawingId }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
      if (audioElement) audioElement.pause();
    };
  }, [timer, audioElement]);

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
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      <div className="flex items-center gap-4">
        {!permissionGranted ? (
          <button 
            onClick={initializeAudio}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Mic className="w-4 h-4" />
            Setup Recording
          </button>
        ) : (
          <div className="flex items-center gap-4">
            {recording ? (
              <button 
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors animate-pulse"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            ) : (
              <button 
                onClick={startRecording}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Mic className="w-4 h-4" />
                Record
              </button>
            )}
            
            {recording && (
              <div className="flex items-center gap-2 text-red-500">
                <Clock className="w-4 h-4" />
                {formatTime(duration)}
              </div>
            )}
          </div>
        )}
      </div>

      {audioUrl && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 p-2 bg-white rounded-lg">
            <audio 
              src={audioUrl} 
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              ref={audio => setAudioElement(audio)}
              className="hidden"
            />
            <button
              onClick={() => {
                if (isPlaying) {
                  audioElement.pause();
                } else {
                  audioElement.play();
                }
              }}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="flex-1">
              <div className="h-1 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ 
                    width: audioElement ? 
                      `${(audioElement.currentTime / audioElement.duration) * 100}%` : 
                      '0%' 
                  }}
                />
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {formatTime(Math.floor(audioElement?.duration || 0))}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => {
                setAudioUrl(null);
                setChunks([]);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CommentPlayer = ({ comment }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioElement) {
      audioElement.addEventListener('timeupdate', () => {
        setProgress((audioElement.currentTime / audioElement.duration) * 100);
      });
      audioElement.addEventListener('loadedmetadata', () => {
        setDuration(Math.floor(audioElement.duration));
      });
    }
  }, [audioElement]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 p-2 bg-white rounded-lg shadow-sm">
      <audio 
        src={comment.audioUrl} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        ref={audio => setAudioElement(audio)}
        className="hidden"
      />
      <button
        onClick={() => {
          if (isPlaying) {
            audioElement.pause();
          } else {
            audioElement.play();
          }
        }}
        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <div className="flex-1">
        <div className="h-1 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <Volume2 className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-500">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default function AudioSection({ drawingId, onSave, comments }) {
  return (
    <div className="flex flex-col gap-4">
      <AudioRecorder drawingId={drawingId} onSave={onSave} />
      
      {comments?.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Audio Comments</h3>
          {comments.map((comment, index) => (
            comment.type === 'audio' && (
              <CommentPlayer key={index} comment={comment} />
            )
          ))}
        </div>
      )}
    </div>
  );
}