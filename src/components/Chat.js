import React, { useEffect, useState, useMemo } from "react";

import { query, orderBy, limit, startAfter, collection } from 'firebase/firestore';
import { auth, db } from "../firebase-config";

import { handleLeaveRoom, handleDeleteRoom } from './RoomHandlers';
import { submitMessage } from './chatManager/MessageHandler';
import { handleGuests } from './chatManager/GuestHandler';
import { listenToMessages } from './chatManager/MessageListener';

import '../styles/Chat.css';

export const Chat = ({ room, user, guest, onGuestListUpdate, onRoomDelete }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [guestList, setGuestList] = useState([]);
  const [lastVisibleMessage, setLastVisibleMessage] = useState(null);

  const messageRef = useMemo(() => room ? collection(db, "rooms", room, "messages") : null, [room]);
  const guestRef = useMemo(() => room ? collection(db, "rooms", room, "guests") : null, [room]);

  const messageQuery = useMemo(() => {
    return lastVisibleMessage
      ? query(messageRef, orderBy("createdAt"), startAfter(lastVisibleMessage), limit(50))
      : query(messageRef, orderBy("createdAt"), limit(50));
  }, [room, lastVisibleMessage, messageRef]);

  useEffect(() => {
    if (!room) return;

    const unsubscribeMessages = listenToMessages(messageQuery, setMessages, setLastVisibleMessage);
    const unsubscribeGuests = handleGuests(guestRef, setGuestList, onGuestListUpdate);

    return () => {
      unsubscribeMessages();
      unsubscribeGuests();
    };
  }, [room, messageQuery, guestRef, onGuestListUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitMessage(messageRef, newMessage, room, guest || auth.currentUser);
    setNewMessage("");
  };

  const handleLeave = async () => {
    await handleLeaveRoom(room, user, guest);
    if (onRoomDelete) onRoomDelete();
  };

  const handleDelete = async () => {
    await handleDeleteRoom(room);
    if (onRoomDelete) onRoomDelete();
  };

  useEffect(() => {
    const handleWindowClose = async (e) => {
      await handleLeave();
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleWindowClose);
    return () => window.removeEventListener('beforeunload', handleWindowClose);
  }, [room]);

  return room ? (
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
      {user && user.displayName === "HostName" && (
        <button onClick={handleDelete} className="delete-room-button">Delete Room</button>
      )}
    </div>
  ) : (
    <div>Loading...</div>
  );
};