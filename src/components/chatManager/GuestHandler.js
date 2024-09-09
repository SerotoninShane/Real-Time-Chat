import { onSnapshot, query, limit } from 'firebase/firestore';

export const handleGuests = (guestRef, setGuestList, onGuestListUpdate) => {
  const guestQuery = query(guestRef, limit(50));

  const unsubscribe = onSnapshot(guestQuery, (snapshot) => {
    const guests = snapshot.docs.map(doc => doc.data().username);
    setGuestList(guests);
    if (onGuestListUpdate) onGuestListUpdate(guests);
  });

  return unsubscribe;
};