import { db } from "../../firebase-config";
import { getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';

export const handleJoinRoom = async (e, roomCode, user, guestUsername, navigate) => {
  e.preventDefault();
  
  if (roomCode) {
    try {
      const roomDocRef = doc(db, "rooms", roomCode);
      const roomDoc = await getDoc(roomDocRef);

      if (roomDoc.exists()) {
        // Create participant object without timestamp
        const player = {
          username: user ? user.displayName : guestUsername,
          role: user ? "user" : "guest",
        };

        // Update the 'participants' array in the room document
        await updateDoc(roomDocRef, {
          player: arrayUnion(player)
        });

        navigate('/room', { state: { roomCode } });
      } else {
        alert("Room code does not exist.");
      }
    } catch (error) {
      console.error("Error joining room: ", error);
    }
  } else {
    alert("Please enter a room code.");
  }
};