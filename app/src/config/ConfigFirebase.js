import { getApp, getApps, initializeApp } from "firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqzhIsqEK4RDh1jSZvlzsifm4iwLZaGqE",
  authDomain: "brico-96615.firebaseapp.com",
  projectId: "brico-96615",
  storageBucket: "brico-96615.firebasestorage.app",
  messagingSenderId: "1045537659707",
  appId: "1:1045537659707:web:ff00bd0352d4ab13ed351e",
  measurementId: "G-ZK8G08MY33"
};



// Firebase Analytics is browser-only for the Firebase web SDK, so do not
// initialize it in this React Native application.
const firebase = getApps().length ? getApp() : initializeApp(firebaseConfig);
let auth;

try {
  auth = initializeAuth(firebase, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // Fast Refresh can re-evaluate this module after Auth already exists.
  if (error.code !== 'auth/already-initialized') throw error;
  auth = getAuth(firebase);
}

export default firebase;
export { auth };
