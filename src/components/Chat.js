import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from "../firebase-config.js";
import '../styles/Chat.css'

export const Chat = (props) => {

    const {room} = props;

    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const messageRef = collection(db, "messages");

    useEffect(() => {
        const queryMessage = query(messageRef, where("room", "==", room), orderBy("createdAt"));
        const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                messages.push({...data, id: doc.id});
            });

            setMessages(messages);
        });

        return () => unsubscribe(); // Cleanup listener on unmount or room change
    }, [room]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage) return;

        try {
            await addDoc(messageRef, {
                text: newMessage,
                createdAt: serverTimestamp(),
                user: auth.currentUser.displayName,
                room: room
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <div className="chat-app">
            <div>
                {messages.map((message) => (
                    <div key={message.id}>{message.text}</div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="new-message-form">
                <input 
                    className="new-message-input" 
                    placeholder={`Message Room: ${room}`}
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                />
                <button type="submit" className="send-button"> Send</button>
            </form>
        </div>
    );
}
