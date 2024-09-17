import React from 'react';

import { auth, provider } from '../../firebase-config';
import { signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';

/**
 * Handles Google sign-in
 */
const signInWithGoogle = async (navigate) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      navigate('/roomBuilder');
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
  }
};

/**
 * Handles Google sign-in button
 * @param {function} navigate - Navigation function from react-router-dom
 */

export const GoogleSignInButton = ({ navigate }) => (
    <button onClick={() => signInWithGoogle(navigate)}>
      Host
    </button>
  );