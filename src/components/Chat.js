import React, { useEffect, useState, useMemo } from "react";

import { addDoc, collection, onSnapshot, serverTimestamp, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { auth, db } from "../firebase-config";

import '../styles/Chat.css';
import { handleLeaveRoom, handleDeleteRoom } from './roomHandlers';

export const Chat = ({ room, user, guest, onGuestListUpdate, onRoomDelete }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [guestList, setGuestList] = useState([]);
  const [lastVisibleMessage, setLastVisibleMessage] = useState(null);

  // Memoize Firestore references
  const messageRef = useMemo(() => room ? collection(db, "rooms", room, "messages") : null, [room]);
  const guestRef = useMemo(() => room ? collection(db, "rooms", room, "guests") : null, [room]);

  // Fetch messages and guests
  useEffect(() => {
    if (!room) return;

    // Messages Query
    const messageQuery = lastVisibleMessage
      ? query(messageRef, orderBy("createdAt"), startAfter(lastVisibleMessage), limit(50))
      : query(messageRef, orderBy("createdAt"), limit(50));

    const unsubscribeMessages = onSnapshot(messageQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setMessages(prev => [...prev, ...newMessages]);
      if (newMessages.length) {
        setLastVisibleMessage(newMessages[newMessages.length - 1].createdAt);
      }
    });

    // Guests Query
    const guestQuery = query(guestRef, limit(50));
    const unsubscribeGuests = onSnapshot(guestQuery, (snapshot) => {
      const guests = snapshot.docs.map(doc => doc.data().username);
      setGuestList(guests);
      if (onGuestListUpdate) {
        onGuestListUpdate(guests);
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeGuests();
    };
  }, [room, messageRef, guestRef, lastVisibleMessage, onGuestListUpdate]);

  // Submit new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage || !room) return;

    try {
      const username = guest || auth.currentUser?.displayName || "Unknown User";
      await addDoc(messageRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: username,
        room,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Leave room
  const handleLeave = async () => {
    if (room) {
      await handleLeaveRoom(room, user, guest);
      if (onRoomDelete) onRoomDelete();
    }
  };

  // Delete room
  const handleDelete = async () => {
    if (room) {
      await handleDeleteRoom(room);
      if (onRoomDelete) onRoomDelete();
    }
  };

  // Handle window close
  useEffect(() => {
    const handleWindowClose = async (e) => {
      await handleLeave();
      e.preventDefault();
      e.returnValue = ''; // For Chrome
    };

    window.addEventListener('beforeunload', handleWindowClose);
    return () => window.removeEventListener('beforeunload', handleWindowClose);
  }, [room]);

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-app">
      <div>
        <h3>Guests in Room:</h3>
        <ul>
          {guestList.map((guest, index) => (
            <li key={index}>{guest}</li>
          ))}
        </ul>
        {messages.map(message => (
          <div key={message.id}>
            <strong>{message.user}:</strong> {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          className="new-message-input"
          placeholder={`Message Room: ${room}`}
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button type="submit" className="send-button">Send</button>
      </form>
      {user && (
        <button onClick={handleLeave} className="leave-room-button">Leave Room</button>
      )}
      {user && user.displayName === "HostName" && ( // Adjust the condition for the host
        <button onClick={handleDelete} className="delete-room-button">Delete Room</button>
      )}
    </div>
  );
};
