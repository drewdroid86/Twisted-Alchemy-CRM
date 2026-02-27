import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const createAccount = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};
