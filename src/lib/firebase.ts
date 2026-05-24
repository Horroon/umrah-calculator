import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth as _getAuth, type Auth } from "firebase/auth";
import { getFirestore as _getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;

function getApp(): FirebaseApp {
  if (!_app) _app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return _app;
}

// Lazy getters — never called during SSR, only inside useEffect / event handlers
export function firebaseAuth(): Auth {
  if (!_auth) _auth = _getAuth(getApp());
  return _auth;
}

export function firebaseDb(): Firestore {
  if (!_db) _db = _getFirestore(getApp());
  return _db;
}
