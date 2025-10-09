import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdg5LKisOiRZPiV3ePBcE8T-dmUYUfQJA",
  authDomain: "holyevent.firebaseapp.com",
  projectId: "holyevent",
  storageBucket: "holyevent.appspot.com",
  messagingSenderId: "940667365808",
  appId: "1:940667365808:web:79b47c0362792c2e39ce75",
  measurementId: "G-YZS0ZB5KHE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore and Auth (safe on server & client)
export const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ Analytics (browser only)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
