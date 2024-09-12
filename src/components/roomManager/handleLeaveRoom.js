import { doc, getDoc, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

export const handleLeaveRoom = async (roomCode, user, guestUsername, navigate) => {
  try {
    const roomDocRef = doc(db, "rooms", roomCode);
    const roomSnapshot = await getDoc(roomDocRef);

    if (roomSnapshot.exists()) {
      const roomData = roomSnapshot.data();

      // Check if there is a user (not the host) leaving the room
      if (user && roomData.host !== user.displayName) {
        // Remove authenticated user from the `player` array
        const player = { username: user.displayName, role: 'user' };
        await updateDoc(roomDocRef, {
          player: arrayRemove(player)
        });
        console.log("Authenticated user successfully removed from the room.");

        // Remove guest document if exists
        if (guestUsername) {
          const guestDocRef = doc(db, "rooms", roomCode, "guests", guestUsername);
          await deleteDoc(guestDocRef);
          console.log("Guest document successfully deleted.");
        }
      } else if (!user && guestUsername) {
        // Handle case for guests
        const player = { username: guestUsername, role: 'guest' };
        await updateDoc(roomDocRef, {
          player: arrayRemove(player)
        });
        console.log("Guest successfully removed from the room.");

        // Remove guest document from the collection
        const guestDocRef = doc(db, "rooms", roomCode, "guests", guestUsername);
        await deleteDoc(guestDocRef);
      }

      // Redirect to the RoomBuilder
      navigate('/roomBuilder'); // Ensure this path matches your RoomBuilder route
    }
  } catch (error) {
    console.error("Error leaving room:", error);
  }
};
