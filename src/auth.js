import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase"; 

const auth = getAuth(app);

export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const signOut = () => fbSignOut(auth);
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);