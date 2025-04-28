// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration (replace with your own Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyA9heoJpA53LZ71_oYOgAzoDrFhyFts7XI",
  authDomain: "powerhive-c55d9.firebaseapp.com",
  databaseURL: "https://powerhive-c55d9-default-rtdb.firebaseio.com",
  projectId: "powerhive-c55d9",
  storageBucket: "powerhive-c55d9.firebasestorage.app",
  messagingSenderId: "974519143958",
  appId: "1:974519143958:web:9674cc08b4662506a72f37",
  measurementId: "G-VVT85L5KNH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
