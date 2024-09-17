import React from 'react';

const ProgressBar = ({ currentTrack, duration, currentTime, progress }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <span className="track-name">{currentTrack.title}</span>
        <span className="track-artist">{currentTrack.artist}</span>
        <span className="track-time">
          {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
          {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0') }
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;