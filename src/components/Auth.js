import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

import { auth, provider } from "../firebase-config.js";
import { signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';

export const Auth = ({ onGuestSignIn }) => {
  const [guestUsername, setGuestUsername] = useState('');
  const navigate = useNavigate();

  // Google sign-in
  const signInWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        navigate('/room-manager');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const handleGuestSignIn = () => {
    console.log('handleGuestSignIn', guestUsername)
    if (guestUsername) {
      onGuestSignIn(guestUsername);
      navigate('/room-manager');
    } else {
      alert("Please enter a username");
    }
  };

  return (
    <section className="auth">

      <div>
        <h3>Play As Guest</h3>
        <input
          type="text"
          placeholder="Enter Username"
          value={guestUsername}
          onChange={(e) => setGuestUsername(e.target.value)}
        />
        <button onClick={handleGuestSignIn}>Continue as Guest</button>
      </div>

      <div>
        <h3>Host And Play</h3>
        <button className="google-button" onClick={signInWithGoogle}>Sign In With Google</button>
      </div>

    </section>
  );
};
