import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useUserStore } from '../store/userStore';

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    userLoading: loading,
    userError: error,
    setUser, 
    clearUser, 
    setUserLoading, 
    setUserError 
  } = useUserStore();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          const fullUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: userData?.displayName || firebaseUser.email,
            ...userData
          };
          
          setUser(fullUser);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUserError(err.message);
          // Still set basic user data even if Firestore fetch fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.email
          });
        }
      } else {
        clearUser();
      }
    });

    return () => unsubscribe();
  }, [setUser, clearUser, setUserError]);
  const signIn = async (email, password) => {
    try {
      setUserError(null);
      setUserLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setUserError(err.message);
      throw err;
    }
  };
  const signUp = async (email, password, displayName) => {
    try {
      setUserError(null);
      setUserLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        displayName,
        createdAt: new Date().toISOString()
      });
      
      return userCredential.user;
    } catch (err) {
      setUserError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      clearUser();
    } catch (err) {
      setUserError(err.message);
      throw err;
    }
  };

  return { user, loading, error, signIn, signUp, logout, isAdmin, isAuthenticated };
};
