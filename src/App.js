import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Auth } from "./components/Auth";
import { Chat } from "./components/Chat";
import { auth } from './firebase-config';  // Firebase auth configuration
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  // State to store the signed-in user and their ID token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [room, setRoom] = useState(null);

  const roomInputRef = useRef(null)

  // Effect to check if a user is already signed in when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If the user is signed in, retrieve their ID token
        const idToken = await user.getIdToken();
        setUser(user);
        setToken(idToken);
      } else {
        // If no user is signed in, clear the state
        setUser(null);
        setToken(null);
      }
    });

    // Cleanup subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to handle sign-in, passed to the Auth component
  const handleSignIn = (userData, userToken) => {
    setUser(userData);  // Update the user state with the signed-in user's info
    setToken(userToken);  // Store the user's token
  };

    // Function to handle sign-out
    const handleSignOut = () => {
      signOut(auth)  // Firebase method to sign out the user
        .then(() => {
          // Reset user and token states
          setUser(null);
          setToken(null);
        })
        .catch((error) => {
          console.error("Error signing out: ", error);
        });
    };
  

  const renderUserAuthSection = () => {
    if (!user) {
      // If no user is signed in, show the Auth component
      return <Auth onSignIn={handleSignIn} />;
    }
    
    // If a user is signed in, show user information
    return ( room ? <Chat room={room}/> :
      <div>
        <h2>Welcome, {user.displayName}!</h2>
        <p>Email: {user.email}</p>
        <button onClick={handleSignOut}>Sign Out</button>
        <div className='room'>
          <input ref={roomInputRef} placeholder='Enter Room Name'></input>
          <button onClick={()=> setRoom(roomInputRef.current.value)}>Enter Room</button>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
        {renderUserAuthSection()}
    </div>
  );
}

export default App;