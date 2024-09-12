import { db } from "../../firebase-config";
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

export const handleCreateRoom = async (user, onRoomCreated, navigate) => {
  if (user) {
    const newRoomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    try {
      // Create a room document in Firestore with host information
      await setDoc(doc(db, "rooms", newRoomCode), {
        host: user.displayName || "Unknown Host",
        createdAt: serverTimestamp(),
      });

      console.log("Room created successfully with code:", newRoomCode);
      
      // Call the onRoomCreated callback with the new room code
      onRoomCreated(newRoomCode);
      
      // Navigate to the Room page with roomCode and hostName in state
      navigate('/room', { 
        state: { 
          roomCode: newRoomCode,
          hostName: user.displayName || "Unknown Host"  // Pass hostName here
        }
      });
    } catch (error) {
      console.error("Error creating room: ", error);
    }
  } else {
    alert("You need to be signed in to create a room.");
  }
};