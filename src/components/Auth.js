import { auth, provider } from "../firebase-config.js";
import { signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { useState, useEffect } from 'react';

export const Auth = ({ onSignIn }) => {
    const signInWithGoogle = async () => {
        try {
            // Set persistence to 'local' so the user stays signed in
            await setPersistence(auth, browserLocalPersistence);

            // Sign in the user
            const result = await signInWithPopup(auth, provider);

            // Get the user's ID token
            const idToken = await result.user.getIdToken();

            // Pass the user data and token back to the parent (App component)
            onSignIn(result.user, idToken);

        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    };

    return (
        <section className="auth">
            <button onClick={signInWithGoogle}>Sign In With Google</button>
        </section>
    );
};
