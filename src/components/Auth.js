import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

import { GuestSignInButton , GoogleSignInButton } from './authManager';

export const Auth = ({ onGuestSignIn }) => {
  const [guestUsername, setGuestUsername] = useState('');
  const navigate = useNavigate();

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
        <GuestSignInButton guestUsername={guestUsername} onGuestSignIn={onGuestSignIn} navigate={navigate} />
      </div>

      <div>
        <h3>Host And Play</h3>
        <GoogleSignInButton navigate={navigate} />
      </div>
    </section>
  );
};

