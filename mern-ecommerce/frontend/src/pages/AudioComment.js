import React, { useState, useRef } from 'react';
import { View, Button, Text } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioComment = ({ audioURL }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const audioPath = useRef(null); // Store audio path reference

  // Start Recording
  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      audioPath.current = result;
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  // Stop Recording
  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setRecordedAudio(result);
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  // Play Audio
  const playAudio = async () => {
    try {
      await audioRecorderPlayer.startPlayer(audioURL || recordedAudio);
      setIsPlaying(true);

      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.current_position === e.duration) {
          setIsPlaying(false);
          audioRecorderPlayer.stopPlayer();
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <View>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
      <Button
        title={isPlaying ? 'Stop Playing' : 'Play Comment'}
        onPress={playAudio}
        disabled={isRecording}
      />
      {recordedAudio && <Text>Recorded Audio: {recordedAudio}</Text>}
    </View>
  );
};

export default AudioComment;
