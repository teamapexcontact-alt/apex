import { initializeApp, cert, getApps, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let app: App | null = null;
let db: Firestore | null = null;
let adminAuth: Auth | null = null;

function getFirebaseAdmin(): App {
  if (app) return app;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  const isPlaceholder = (v: string | undefined) => !v || v.includes("YOUR_");

  if (isPlaceholder(projectId) || isPlaceholder(clientEmail) || isPlaceholder(privateKey)) {
    console.warn("[Firebase Admin] Not configured (placeholder or missing env vars). Firebase Admin will be null.");
    return null as unknown as App;
  }

  if (!getApps().length) {
    const parsedKey = privateKey!.startsWith("-----BEGIN")
      ? privateKey!
      : privateKey!.replace(/\\n/g, "\n");
    app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey: parsedKey }),
    });
  } else {
    app = getApps()[0];
  }

  return app;
}

export function getDb(): Firestore {
  if (!db) {
    const adminApp = getFirebaseAdmin();
    if (!adminApp) return null as unknown as Firestore;
    db = getFirestore(adminApp);
  }
  return db;
}

export function getAdminAuth(): Auth {
  if (!adminAuth) {
    const adminApp = getFirebaseAdmin();
    if (!adminApp) return null as unknown as Auth;
    adminAuth = getAuth(adminApp);
  }
  return adminAuth;
}
