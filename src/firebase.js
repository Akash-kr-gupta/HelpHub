// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // YOUR FIREBASE CONFIG
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... etc
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;