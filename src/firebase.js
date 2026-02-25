// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFQvCDPG7TEdrawbyj-eylUyz44X_zGBc",
    authDomain: "twistedalchemy-crm.firebaseapp.com",
      projectId: "twistedalchemy-crm",
        storageBucket: "twistedalchemy-crm.firebasestorage.app",
          messagingSenderId: "203366267658",
            appId: "1:203366267658:web:e173ffdea8eb8c57ff58f3",
              measurementId: "G-6GME690775"
              };

              // Initialize Firebase
              const app = initializeApp(firebaseConfig);
              const analytics = getAnalytics(app);