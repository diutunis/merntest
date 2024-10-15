// src/pages/AudioPlayer.js
import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ playlist }) => {
  const audioRef = useRef(null);
  let currentIndex = 0;

  const playNextSong = () => {
    currentIndex = (currentIndex + 1) % playlist.length; // Loop back to start
    audioRef.current.src = playlist[currentIndex];
    audioRef.current.play();
  };

  useEffect(() => {
    audioRef.current.src = playlist[currentIndex];
    audioRef.current.play();

    audioRef.current.onended = playNextSong; // Play next song when current ends

    return () => {
      audioRef.current.pause();
    };
  }, []);

  return (
    <audio ref={audioRef} controls style={{ width: '100%' }} />
  );
};

export default AudioPlayer;
