import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/analytics";

// Configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyCJdAyXCJDJAxpseBG-bQ9Ve2KY0tEu91c",
  authDomain: "aymen-d28a5.firebaseapp.com",
  projectId: "aymen-d28a5",
  storageBucket: "aymen-d28a5.firebasestorage.app",
  messagingSenderId: "435851372072",
  appId: "1:435851372072:web:59d04324a41b072f17771d",
  measurementId: "G-C5BQ8EEH7M"
};

// Initialize Firebase
// Check if apps already initialized to prevent re-initialization errors
export const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
export const auth = firebase.auth();
export const analytics = firebase.analytics();

export default firebase;