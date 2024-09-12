import { useEffect, useMemo } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from "../../firebase-config";

// Firestore utility functions
export const getRoomDocRef = (room) => room ? doc(db, "rooms", room) : null;

// Room listeners hook
export const useRoomListeners = (room, navigate) => {
  const roomDocRef = useMemo(() => getRoomDocRef(room), [room]);

  useEffect(() => {
    if (!room || !roomDocRef) return;

    const unsubscribeRoom = onSnapshot(roomDocRef, (snapshot) => {
      if (!snapshot.exists()) {
        alert("The room has been deleted by the host.");
        navigate('/roomBuilder'); // Redirect to roomBuilder when the room is deleted
      }
    });

    return () => {
      unsubscribeRoom();
    };
  }, [room, roomDocRef, navigate]);
};
