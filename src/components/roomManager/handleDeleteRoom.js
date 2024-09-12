import { deleteDoc, doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase-config';

// Function to handle room deletion
export const handleDeleteRoom = async (roomCode, navigate) => {
  try {
    const roomDocRef = doc(db, "rooms", roomCode);
    
    // Get all guest documents
    const guestsSnapshot = await getDocs(collection(db, "rooms", roomCode, "guests"));
    const guestDocs = guestsSnapshot.docs;
    
    // Remove guest documents
    for (const guestDoc of guestDocs) {
      await deleteDoc(guestDoc.ref);
    }

    // Delete the room document
    await deleteDoc(roomDocRef);
    console.log("Room successfully deleted!");

    // Redirect to room builder
    navigate('/roomBuilder');
  } catch (error) {
    console.error("Error deleting room:", error);
  }
};