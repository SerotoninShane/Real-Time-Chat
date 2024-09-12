import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleLeaveRoom, handleDeleteRoom, PlayerList, usePlayers, useRoomListeners, useWindowClose } from './roomManager';
import Game from './Game';
import '../styles/Room.css';

export const Room = ({ user, guest, onRoomDelete }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [hostName, setHostName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (location.state?.roomCode) {
      setRoomCode(location.state.roomCode);
      setHostName(location.state.hostName);
    }
  }, [location.state]);

  const { players, loading } = usePlayers(roomCode);

  const isHost = user && user.displayName === hostName;

  useRoomListeners(roomCode, navigate);
  useWindowClose(() => handleLeave(roomCode, user, guest, navigate), isHost);

  const handleLeave = async () => {
    await handleLeaveRoom(roomCode, user, guest, navigate);
    if (onRoomDelete) onRoomDelete();
  };

  const handleDelete = async () => {
    await handleDeleteRoom(roomCode);
    if (onRoomDelete) onRoomDelete();
  };

  const startGame = () => {
    setGameStarted(true);
    console.log('Game started!');
  };

  return roomCode ? (
    <div className="room">
      <h3>Players in Room:</h3>
      {loading ? (
        <p>Loading... Players</p>
      ) : (
        <PlayerList players={players} />
      )}
      {!user || user.displayName !== hostName ? (
        <button onClick={handleLeave} className="leave-room-button">
          Leave Room
        </button>
      ) : null}
      {user && user.displayName === hostName && (
        <>
          <button onClick={handleDelete} className="delete-room-button">
            Delete Room
          </button>
          {!gameStarted && (
            <button onClick={startGame} className="start-game-button">
              Start Game
            </button>
          )}
        </>
      )}
      {gameStarted && (
        <Game roomCode={roomCode} hostName={hostName} currentUser={user} />
      )}
    </div>
  ) : (
    <div>Loading... Room</div>
  );
};