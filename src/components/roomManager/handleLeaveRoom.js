import { deleteDoc, doc, getDoc, collection, getDocs, deleteDoc as deleteDocInCollection } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { handleDeleteRoom } from './handleDeleteRoom';

export const handleLeaveRoom = async (roomCode, user, guestUsername) => {
    try {
      const roomDocRef = doc(db, "rooms", roomCode);
      const roomSnapshot = await getDoc(roomDocRef);
  
      if (roomSnapshot.exists()) {
        // Check if the user is the host
        if (user && roomSnapshot.data().host === user.displayName) {
          // If the user is the host, delete the room and all guests
          console.log("Host is leaving, deleting the room...");
          
          // Remove all guests
          const guestsRef = collection(db, "rooms", roomCode, "guests");
          const guestDocs = await getDocs(guestsRef);
          guestDocs.forEach(async (doc) => {
            await deleteDocInCollection(doc.ref);
          });
          
          // Delete the room
          await handleDeleteRoom(roomCode);
        } else {
          // If the user is not the host, remove the guest from the room
          const guestDocRef = doc(db, "rooms", roomCode, "guests", guestUsername);
          await deleteDoc(guestDocRef);
          console.log("Guest successfully removed from the room.");
        }
      }
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };