import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
// Replace placeholder keys with your real Firebase project keys
const firebaseConfig = {
  apiKey: "AIzaSyB8czj4RmsPNjE6qKKPNqiL1KWWP7JeXnI",
  authDomain: "agriskills-595d6.firebaseapp.com",
  databaseURL: "https://agriskills-595d6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "agriskills-595d6",
  storageBucket: "agriskills-595d6.appspot.com",
  messagingSenderId: "81064877661",
  appId: "1:81064877661:web:2eb5ef94ef95dd796277b4",
  measurementId: "G-YXN84BG5Y7",
};

export const app = initializeApp(firebaseConfig);
// initialize compat for libraries that rely on firebase v8 API
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
export const auth = getAuth(app);
export const analytics = (typeof window !== 'undefined') ? getAnalytics(app) : null;
export const compatApp = firebase.app();

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
