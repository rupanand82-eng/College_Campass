import { initializeApp, getApps, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let appInstance: App | null = null;
let firestoreInstance: Firestore | null = null;

export function getFirestoreAdmin(): Firestore | null {
  if (firestoreInstance) return firestoreInstance;

  try {
    if (getApps().length === 0) {
      if (process.env.FIREBASE_CONFIG || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        appInstance = initializeApp();
        firestoreInstance = getFirestore(appInstance);
      }
    } else {
      appInstance = getApps()[0];
      firestoreInstance = getFirestore(appInstance);
    }
  } catch (err) {
    console.warn("Firebase Admin not initialized; local database in active mode.");
  }

  return firestoreInstance;
}
