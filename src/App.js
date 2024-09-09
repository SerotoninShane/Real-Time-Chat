import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { auth, db } from './firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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

        const userDoc = doc(db, "users", authUser.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          setRoom(userSnapshot.data().roomCode);
          navigate('/chat');
        } else {
          navigate('/room-manager');
        }
      } else {
        setUser(null);
        setRoom(null);
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGuestSignIn = (guestUsername) => {
    setGuestUsername(guestUsername);
    navigate('/room-manager');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRoom(null);
      setGuestUsername("");
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
