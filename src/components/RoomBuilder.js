import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoomBuilder.css';
import { handleCreateRoom, handleJoinRoom, CreateRoomButton, JoinRoomForm, UserInfo } from './roomBuilderManager';

export const RoomBuilder = ({ user, guestUsername, onRoomCreated, onSignOut }) => {
  const [username, setUsername] = useState(guestUsername || "");
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  
  const icons = ['🦸‍♀️', '🦸‍♂️', '👨‍🚀', '🧙‍♂️', '🧟‍♂️']; // Example icons

  return (
    <div className='roomBuilder'>
      
      {!user ? (
        <>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="character-selection">
            <div className="selected-icon">
              <span>{icons[selectedIcon]}</span>
            </div>
          </div>
          <div className="icon-carousel">
            {icons.map((icon, index) => (
              <div
                key={index}
                className={`carousel-icon ${selectedIcon === index ? 'active' : ''}`}
                onClick={() => setSelectedIcon(index)}
              >
                {icon}
              </div>
            ))}
          </div>
        </>
      ) : (
        <h2>{user.displayName || username || "Guest"}</h2>
      )}

      <div>
        <CreateRoomButton 
          user={user} 
          onCreateRoom={() => handleCreateRoom(user, onRoomCreated, navigate)}
        />
        { (
          <UserInfo onSignOut={onSignOut} />
        )}
      </div>

      <div>
        <h2>Join A Room</h2>
        <JoinRoomForm
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          onJoinRoom={(e) => handleJoinRoom(e, roomCode, user, username, navigate)}
        />
      </div>
    </div>
  );
};
