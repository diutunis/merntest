// src/pages/AudioPlayer.js
import React, { useRef, useState } from 'react';

const AudioPlayer = ({ playlist }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  let currentIndex = 0;

  const playNextSong = () => {
    currentIndex = (currentIndex + 1) % playlist.length; // Loop back to start
    audioRef.current.src = playlist[currentIndex];
    audioRef.current.play().catch((error) => {
      console.error('Error playing next song:', error);
    });
  };

  const startPlaying = () => {
    audioRef.current.src = playlist[currentIndex];
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((error) => console.error('Failed to play:', error));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {!isPlaying && (
        <button onClick={startPlaying} style={{ fontSize: '18px', padding: '10px 20px' }}>
          Music
        </button>
      )}
      {isPlaying && (
        <audio
          ref={audioRef}
          controls
          autoPlay
          style={{ width: '100%', marginTop: '10px' }}
          onEnded={playNextSong}
        />
      )}
    </div>
  );
};

export default AudioPlayer;
