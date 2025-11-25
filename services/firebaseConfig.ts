
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyCFxSHbd01pVJUyM6wuvAgwbnyvLOHITtA", 
  authDomain: "gen-lang-client-0239027305.firebaseapp.com",
  projectId: "gen-lang-client-0239027305",
  storageBucket: "gen-lang-client-0239027305.appspot.com", 
  messagingSenderId: "465401193398", 
  appId: "1:465401193398:web:152179e8b75bd079ce5717"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);

// Initialize Firestore with modern offline persistence settings
// This replaces the deprecated enableIndexedDbPersistence() and fixes the 12.6.0 warning
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const storage = getStorage(app);
