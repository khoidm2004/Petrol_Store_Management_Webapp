import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgAEWOMRs6xPSulEiXYZgucePF6O3FXaM",
  authDomain: "petrol-b65ed.firebaseapp.com",
  projectId: "petrol-b65ed",
  storageBucket: "petrol-b65ed.appspot.com",
  messagingSenderId: "440096217965",
  appId: "1:440096217965:web:7685ed6565e8c70bfa1864",
  measurementId: "G-DV4DF3BEZK",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
