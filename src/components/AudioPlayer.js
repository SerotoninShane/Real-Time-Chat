import React, { useState, useEffect, useRef } from 'react';
import musicFiles from './musicFiles'; // Import the JS file
import ProgressBar from './ProgressBar'; // Import the ProgressBar component

export const AudioPlayer = () => {
  const [audio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);  // Reference to the canvas element

  const getCurrentTrack = () => musicFiles[currentIndex] || { title: 'Unknown', artist: 'Unknown', src: '' };

  const handleAudioSource = () => {
    if (audioContextRef.current && analyserRef.current) {
      try {
        const source = audioContextRef.current.createMediaElementSource(audio);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    // Create AudioContext and AnalyserNode only once
    const context = new AudioContext();
    const analyserNode = context.createAnalyser();
    analyserNode.fftSize = 256;  // Adjust the fft size to get more or fewer frequency bars
    audioContextRef.current = context;
    analyserRef.current = analyserNode;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('ended', handleNextTrack);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);

    return () => {
      audio.removeEventListener('ended', handleNextTrack);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
    };
  }, [audio]);

  useEffect(() => {
    // Update the audio source and reconnect the nodes
    const track = getCurrentTrack();
    audio.src = track.src;
    handleAudioSource(); // Reconnect the nodes with the new source

    // Auto-play if currently playing
    if (isPlaying) {
      audio.play().catch(error => console.error('Play failed:', error));
    }
  }, [currentIndex]);

  useEffect(() => {
    // Handle play/pause
    if (isPlaying) {
      audio.play().catch(error => console.error('Play failed:', error));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    // Visualize audio data
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const previousHeights = new Array(analyserRef.current.frequencyBinCount).fill(0);

    const smoothingFactor = 0.1;

    const drawBars = () => {
      if (analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const frequencyData = new Uint8Array(bufferLength);

        analyserRef.current.getByteFrequencyData(frequencyData);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT); // Clear the canvas
        const barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = (frequencyData[i] / 255) * HEIGHT * 1.6; // 1.5 multiplier for more dramatic movement
            barHeight = Math.max(barHeight, 20);

            previousHeights[i] = previousHeights[i] + smoothingFactor * (barHeight - previousHeights[i]);
            barHeight = previousHeights[i];

          const r = Math.round(255 * (i / bufferLength)); // Constant red
          const g = Math.round(255 * (i / bufferLength)); // Gradual increase from 0 to 255
          const b = Math.round(255 * (i / bufferLength)); // Gradual increase from 0 to 255

          canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
          canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

          x += barWidth + 1;
        }

        requestAnimationFrame(drawBars);
      }
    };

    drawBars();
  }, []);

  const handlePlayPause = () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().then(() => {
        setIsPlaying(prev => !prev);
      }).catch(error => console.error('AudioContext resume failed:', error));
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const handleNextTrack = () => {
    setCurrentIndex(prev => (prev + 1) % musicFiles.length);
    setIsPlaying(false);
    handlePlayPause()
  };

  const handlePreviousTrack = () => {
    setCurrentIndex(prev => (prev - 1 + musicFiles.length) % musicFiles.length);
    setIsPlaying(false);
    handlePlayPause()
  };

  const currentTrack = getCurrentTrack();
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div>
      <div className="audio-controls">
        <button onClick={handlePreviousTrack}>
          <img src="/Icons/Controls/reverse.png" alt="Previous" />
        </button>
        <button onClick={handlePlayPause} className="play-pause">
          <img src={isPlaying ? "/Icons/Controls/pause.png" : "/Icons/Controls/play.png"} alt={isPlaying ? 'Pause' : 'Play'} />
        </button>
        <button onClick={handleNextTrack}>
          <img src="/Icons/Controls/skip.png" alt="Next" />
        </button>
      </div>
      <ProgressBar
        currentTrack={currentTrack}
        duration={duration}
        currentTime={currentTime}
        progress={progress}
      />
      <canvas ref={canvasRef} width={window.innerWidth} height="800" style={{ background: '#000' }} />
    </div>
  );
};
