import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "../firebase-config";
import { getDoc, setDoc, doc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import '../styles/RoomManager.css';

export const RoomManager = ({ user, guestUsername, onRoomCreated, onSignOut }) => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (user) { // Ensure only signed-in users can create rooms
      const newRoomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      try {
        await setDoc(doc(db, "rooms", newRoomCode), {
          host: user?.displayName || "Unknown Host",  // Optional chaining to handle null user
          createdAt: serverTimestamp(),
        });

        const userDoc = doc(db, "users", user.uid);
        await setDoc(userDoc, { roomCode: newRoomCode });

        onRoomCreated(newRoomCode);
        navigate('/chat');
      } catch (error) {
        console.error("Error creating room: ", error);
      }
    } else {
      alert("You need to be signed in to create a room.");
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (roomCode) {
      try {
        const roomDocRef = doc(db, "rooms", roomCode);
        const roomDoc = await getDoc(roomDocRef);

        if (roomDoc.exists()) {
          if (user) {
            navigate('/chat');
          } else if (guestUsername) {
            await addDoc(collection(db, "rooms", roomCode, "guests"), {
              username: guestUsername,
              joinedAt: serverTimestamp(),
            });
            navigate('/chat');
          } else {
            alert("Please enter a username to join as a guest.");
          }
        } else {
          alert("Room code does not exist.");
        }
      } catch (error) {
        console.error("Error joining room: ", error);
      }
    } else {
      alert("Please enter a room code.");
    }
  };

  return (
    <div className='room-manager'>
      <div>
        <h2>{user?.displayName || guestUsername || "Guest"}</h2>
        {user ? (
          <>
            <button className='create-room-button' onClick={handleCreateRoom}>Create Room</button>
          </>
        ) : (
          <p className='disclaimer'>(Please sign in to create a room.)</p>
        )}
        {(user || guestUsername) && (
          <div className="user-info">
            <button className='sign-out-button' onClick={onSignOut}>Sign Out</button>
          </div>
        )}
      </div>
      <div>
        <h2>Join A Room</h2>
        <form onSubmit={handleJoinRoom}>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button className='join-room-button' type="submit">Join Room</button>
        </form>
      </div>
    </div>
  );
};
