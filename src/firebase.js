import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyD-lXHqaJv_ZTtjKPXYpK_r7wAjh6rXYWE",
  authDomain: "instagram-clone-402fe.firebaseapp.com",
  databaseURL: "https://instagram-clone-402fe.firebaseio.com",
  projectId: "instagram-clone-402fe",
  storageBucket: "instagram-clone-402fe.appspot.com",
  messagingSenderId: "275756354202",
  appId: "1:275756354202:web:8077760b12cd2bc69aed23",
  measurementId: "G-569TW3TR9E"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage};
