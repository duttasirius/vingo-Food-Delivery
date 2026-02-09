// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-food-delivery-4e86d.firebaseapp.com",
  projectId: "vingo-food-delivery-4e86d",
  storageBucket: "vingo-food-delivery-4e86d.firebasestorage.app",
  messagingSenderId: "321148148358",
  appId: "1:321148148358:web:f09e1e5bee8ecadeb8cf07",
};

// Initialize Firebase
//That creates the Firebase app instance.
//But it does not automatically enable authentication.
const app = initializeApp(firebaseConfig);

//This line gets the Firebase Authentication service for your app.
const auth = getAuth(app);

export { app, auth };
