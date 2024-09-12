import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoomBuilder.css';
import { handleCreateRoom, handleJoinRoom, CreateRoomButton, JoinRoomForm, UserInfo } from './roomBuilderManager';

export const RoomBuilder = ({ user, guestUsername, onRoomCreated, onSignOut }) => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  return (
    <div className='roomBuilder'>
      <div>
        <h2>{user?.displayName || guestUsername || "Guest"}</h2>
        <CreateRoomButton 
          user={user} 
          onCreateRoom={() => handleCreateRoom(user, onRoomCreated, navigate)}
        />
        {(!user || user || guestUsername) ? (
          <UserInfo onSignOut={onSignOut} />
        ): null}
      </div>
      <div>
        <h2>Join A Room</h2>
        <JoinRoomForm
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          onJoinRoom={(e) => handleJoinRoom(e, roomCode, user, guestUsername, navigate)}
        />
      </div>
    </div>
  );
};
