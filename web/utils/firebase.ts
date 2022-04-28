import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from '@firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBR1Bsyyg7eByNaNyzLJnpt9hhfxHxhmjo',
  authDomain: 'giftnftcards.firebaseapp.com',
  projectId: 'giftnftcards',
  storageBucket: 'giftnftcards.appspot.com',
  messagingSenderId: '839087068924',
  appId: '1:839087068924:web:1061d38406c17037d5a979',
};

export const firebaseApp = initializeApp(firebaseConfig);

// Login to the app anonymously immediately. Only logged in
// user can upload images.
const auth = getAuth(firebaseApp);
signInAnonymously(auth).catch((error) => {
  console.log(error);
});
