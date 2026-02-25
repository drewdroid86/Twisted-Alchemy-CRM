import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAFQvCDPG7TEdrawbyj-eylUyz44X_zGBc",
  authDomain: "twistedalchemy-crm.firebaseapp.com",
  projectId: "twistedalchemy-crm",
  storageBucket: "twistedalchemy-crm.firebasestorage.app",
  messagingSenderId: "203366267658",
  appId: "1:203366267658:web:e173ffdea8eb8c57ff58f3",
  measurementId: "G-6GME690775"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };