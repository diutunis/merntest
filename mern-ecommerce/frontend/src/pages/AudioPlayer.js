// src/pages/AudioPlayer.js
import React, { useRef, useState } from 'react';

const AudioPlayer = ({ playlist }) => {
  const audioRef = useRef(null); // Ref for the audio element
  const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing
  let currentIndex = 0;

  const playNextSong = () => {
    currentIndex = (currentIndex + 1) % playlist.length; // Loop to the first song if at the end
    audioRef.current.src = playlist[currentIndex];
    audioRef.current.play().catch((error) => {
      console.error('Error playing next song:', error);
    });
  };

  const startPlaying = () => {
    audioRef.current.src = playlist[currentIndex]; // Set initial song source
    audioRef.current
      .play()
      .then(() => setIsPlaying(true)) // Update state to show player
      .catch((error) => console.error('Failed to play:', error));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {/* Music button appears only if music isn't playing */}
      {!isPlaying && (
        <button
          onClick={startPlaying}
          style={{ fontSize: '18px', padding: '10px 20px' }}
        >
          Music
        </button>
      )}

      {/* Render audio element always (but hidden initially) */}
      <audio
        ref={audioRef}
        controls
        style={{ width: '100%', marginTop: '10px', display: isPlaying ? 'block' : 'none' }}
        onEnded={playNextSong}
      />
    </div>
  );
};

export default AudioPlayer;
