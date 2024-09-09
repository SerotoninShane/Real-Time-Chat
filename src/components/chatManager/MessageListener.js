import { onSnapshot } from 'firebase/firestore';

export const listenToMessages = (messageQuery, setMessages, setLastVisibleMessage) => {
  return onSnapshot(messageQuery, (snapshot) => {
    const newMessages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setMessages(prev => [...prev, ...newMessages]);
    if (newMessages.length) {
      setLastVisibleMessage(newMessages[newMessages.length - 1].createdAt);
    }
  });
};