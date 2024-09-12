import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';

export const handleDeleteRoom = async (roomCode, hostName) => {
  try {
    const roomDocRef = doc(db, "rooms", roomCode);
    await deleteDoc(roomDocRef);
  } catch (error) {
    console.error("Error deleting room:", error);
  }
};
