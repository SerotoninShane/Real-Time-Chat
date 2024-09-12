import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { auth } from './firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import './styles/App.css';
import { Auth } from './components/Auth';
import { RoomBuilder } from './components/RoomBuilder';
import { Room } from './components/Room';

function App() {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [guestUsername, setGuestUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser && user === null) {
        setUser(authUser);
        if (window.location.pathname !== '/roomBuilder') navigate('/roomBuilder');
      } else if (!authUser && !guestUsername && user !== null) {
        if (window.location.pathname !== '/') navigate('/');
        setUser(null);
        setRoom(null);
      }
    });
  
    return () => unsubscribe();
  }, [navigate, guestUsername, user]);

  const handleGuestSignIn = (guestUsername) => {
    setGuestUsername(guestUsername);
  };

  const handleSignOut = async () => {
    try {
      if (user) {
        await signOut(auth);
        setUser(null);
      }

      setGuestUsername("");
      setRoom(null);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleRoomDelete = () => {
    console.log('Room Deleted');
    setRoom(null);
    navigate('/roomBuilder');
  };

  const handleRoomCreated = (newRoomCode) => {
    setRoom(newRoomCode);
    navigate('/room', { state: { roomCode: newRoomCode } });
  };

  return (
    <div className="App">
      <Routes>

      <Route path="/" element={
        <Auth onSignIn={() => {}}
        onGuestSignIn={handleGuestSignIn} />} 
      />

      <Route path="/roomBuilder" element={
        <RoomBuilder
          user={user}
          onRoomCreated={handleRoomCreated}
          onSignOut={handleSignOut}
          guestUsername={guestUsername} />} 
      />

      <Route path="/room" element={
        <Room
          room={room}
          user={user}
          guest={guestUsername}
          onRoomDelete={handleRoomDelete}
        />}
      />

      </Routes>
    </div>
  );
}

export default App;
