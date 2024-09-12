import { useState, useEffect } from 'react';
import { db } from "../../firebase-config";
import { doc, onSnapshot } from 'firebase/firestore';

export const usePlayers = (roomCode) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomCode) {
      setLoading(false);
      return;
    }

    const roomDocRef = doc(db, "rooms", roomCode);

    const unsubscribe = onSnapshot(roomDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log("Current players data:", data);
        setPlayers(data.player || []); // Update 'players' to 'player' to match Firestore data
      } else {
        setPlayers([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching players: ", error);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [roomCode]); // Only re-run effect if roomCode changes

  return { players, loading };
};