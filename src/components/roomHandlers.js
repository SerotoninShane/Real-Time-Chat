import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

// Function to handle a user leaving a room
export const handleLeaveRoom = async (roomCode, user, guestUsername) => {
  try {
    const roomDocRef = doc(db, "rooms", roomCode);
    const roomSnapshot = await getDoc(roomDocRef);

    if (roomSnapshot.exists()) {
      if (user && roomSnapshot.data().host === user.displayName) {
        console.error("Host cannot use leave room functionality");
      } else {
        const guestDocRef = doc(db, "rooms", roomCode, "guests", guestUsername);
        await deleteDoc(guestDocRef);
      }
    }
  } catch (error) {
    console.error("Error leaving room:", error);
  }
};

// Function to handle deleting the room
export const handleDeleteRoom = async (roomCode) => {
  try {
    const roomDocRef = doc(db, "rooms", roomCode);
    await deleteDoc(roomDocRef);
    console.log("Room successfully deleted!");
  } catch (error) {
    console.error("Error deleting room:", error);
  }
};
