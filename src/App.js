import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { auth } from './firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import './styles/App.css';
import { Auth } from './components/Auth';
import { RoomManager } from './components/RoomManager';
import { Chat } from './components/Chat';

function App() {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [guestUsername, setGuestUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        navigate('/room-manager');
      } else if (guestUsername) { // Check if guest is logged in
        navigate('/room-manager');
      } else {
        console.log('Not authenticated and no guest detected');
        if (window.location.pathname !== '/') navigate('/');
        setUser(null);
        setRoom(null);
      }
    });
  
    return () => unsubscribe();
  }, [navigate, guestUsername]); // Add guestUsername to the dependency array

  const handleGuestSignIn = (guestUsername) => {
    setGuestUsername(guestUsername);
    navigate('/room-manager');
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
    setRoom(null);
    setGuestUsername("");
    navigate('/');
  };

  return (
    <div className="App">
      <Routes>

      <Route path="/" element={
        <Auth onSignIn={() => {}}
        onGuestSignIn={handleGuestSignIn} />} 
      />

      <Route path="/room-manager" element={
        <RoomManager user={user}
        onRoomCreated={setRoom}
        onSignOut={handleSignOut}
        guestUsername={guestUsername} />} 
      />

      <Route path="/chat" element={
        <Chat
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
