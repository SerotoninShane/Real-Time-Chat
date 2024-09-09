import { addDoc, serverTimestamp } from 'firebase/firestore';

export const submitMessage = async (messageRef, newMessage, room, user) => {
  if (!newMessage || !room) return;
  
  try {
    const username = user?.displayName || "Unknown User";
    await addDoc(messageRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: username,
      room,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};