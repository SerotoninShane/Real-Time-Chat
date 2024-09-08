import { initializeApp }from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAXLTG4teA1dRr59Fmk-2SG9Oiqn63LZaY",
  authDomain: "serotoninshanelive.firebaseapp.com",
  projectId: "serotoninshanelive",
  storageBucket: "serotoninshanelive.appspot.com",
  messagingSenderId: "4831309572",
  appId: "1:4831309572:web:d1d9febedf60862ea52a51",
  measurementId: "G-940SWC4LL8"
};

// const analytics = getAnalytics(app);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();