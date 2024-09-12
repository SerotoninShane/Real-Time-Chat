import React from 'react';

/**
 * Create Room Button Component
 */
export const CreateRoomButton = ({ user, onCreateRoom }) => (
  user ? (
    <button className='create-room-button' onClick={onCreateRoom}>
      Create Room
    </button>
  ) : (
    <p className='disclaimer'>(Please sign in to create a room.)</p>
  )
);

/**
 * Join Room Form Component
 */
export const JoinRoomForm = ({ roomCode, setRoomCode, onJoinRoom }) => (
  <form onSubmit={onJoinRoom}>
    <input
      type="text"
      placeholder="Enter Room Code"
      value={roomCode}
      onChange={(e) => setRoomCode(e.target.value)}
    />
    <button className='join-room-button' type="submit">Join Room</button>
  </form>
);

/**
 * User Info and Sign Out Button Component
 */
export const UserInfo = ({ onSignOut }) => (
  <div className="user-info">
    <button className='sign-out-button' onClick={onSignOut}>Sign Out</button>
  </div>
);