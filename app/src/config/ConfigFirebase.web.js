import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// The browser Auth build supplies its own durable persistence (IndexedDB/local
// storage). `getReactNativePersistence` only exists in Firebase's native build,
// so importing it here causes Metro web to fail during module evaluation.
const firebaseConfig = {
  apiKey: 'AIzaSyAqzhIsqEK4RDh1jSZvlzsifm4iwLZaGqE',
  authDomain: 'brico-96615.firebaseapp.com',
  projectId: 'brico-96615',
  storageBucket: 'brico-96615.firebasestorage.app',
  messagingSenderId: '1045537659707',
  appId: '1:1045537659707:web:ff00bd0352d4ab13ed351e',
  measurementId: 'G-ZK8G08MY33',
};

const firebase = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(firebase);

export default firebase;
export { auth };
