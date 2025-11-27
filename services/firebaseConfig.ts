// @ts-ignore -- Suppress potential type mismatch for initializeApp in some environments
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, Firestore } from "firebase/firestore";
import { Project } from "../types";

// Configuration uses environment variables to prevent hardcoding secrets
// Ensure you have a .env file in your root directory
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize only if not already initialized (singleton-ish safety)
let app;
let db: Firestore | null = null;

// Validate that critical config exists
const isConfigured = 
  !!firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "your_api_key" && 
  !!firebaseConfig.projectId;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("MONARCH: Firebase initialized successfully");
  } catch (error) {
    console.error("MONARCH: Firebase initialization failed:", error);
  }
} else {
  console.warn("MONARCH: Firebase config missing or invalid. Check your .env file.");
}

const PROJECTS_COLLECTION = "monarch_projects";

export const getProjects = async (): Promise<Project[]> => {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (e) {
    console.error("Error fetching projects: ", e);
    return [];
  }
};

export const saveProject = async (project: Project): Promise<void> => {
  if (!db) {
    console.warn("Cannot save: Database not connected");
    return;
  }
  try {
    await setDoc(doc(db, PROJECTS_COLLECTION, project.id), project);
  } catch (e) {
    console.error("Error saving project: ", e);
  }
};

export const deleteProjectFromDb = async (id: string): Promise<void> => {
  if (!db) return;
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
  } catch (e) {
    console.error("Error deleting project: ", e);
  }
};

export { db };