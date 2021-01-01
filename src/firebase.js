// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUafOYSgd77oySaONpID2hVxCTT7Eubbo",
  authDomain: "whatsapp-clone-94f2b.firebaseapp.com",
  projectId: "whatsapp-clone-94f2b",
  storageBucket: "whatsapp-clone-94f2b.appspot.com",
  messagingSenderId: "1031065814877",
  appId: "1:1031065814877:web:04e2c5734ed880d8870ab4",
  measurementId: "G-EL3XH9410Q",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
