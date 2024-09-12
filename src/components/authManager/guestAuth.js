import React from 'react';

const handleGuestSignIn = (guestUsername, onGuestSignIn, navigate) => {
    if (guestUsername) {
      onGuestSignIn(guestUsername);
      navigate('/roomBuilder');
    } else {
      alert("Please enter a username");
    }
};

const GuestSignInButton = React.memo(({ guestUsername, onGuestSignIn, navigate }) => (
    <button onClick={() => handleGuestSignIn(guestUsername, onGuestSignIn, navigate)}>
      Continue as Guest
    </button>
));

export { GuestSignInButton };