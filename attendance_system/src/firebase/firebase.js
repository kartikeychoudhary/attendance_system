import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: "attendance-system-journal.firebaseapp.com",
  databaseURL: "https://attendance-system-journal.firebaseio.com",
  projectId: "attendance-system-journal",
  storageBucket: "attendance-system-journal.appspot.com",
  messagingSenderId: "923005232140",
  appId: "1:923005232140:web:6f289450b35a5e7a3cfa29",
  measurementId: "G-9TD67ZGGSZ",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();
firebase.storage();

export default firebase;

export function signIn(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function signOut() {
  firebase.auth().signOut();
}

export function getCollection(typeElements, uid) {
  return firebase
    .firestore()
    .collection(typeElements)
    .where("uid", "==", uid)
    .get();
}

export function getDocById(typeElements, id) {
  console.log(firebase.firestore().collection(typeElements).doc(id).get());
  return firebase.firestore().collection(typeElements).doc(id).get();
}

export function addDoc(typeElements, doc) {
  return firebase.firestore().collection(typeElements).add(doc);
}

export function updateDoc(typeElements, id, newDoc) {
  return firebase.firestore().collection(typeElements).doc(id).update(newDoc);
}

export function deleteDoc(typeElements, id) {
  firebase.firestore().collection(typeElements).doc(id).delete();
}
export function createUser(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password);
}

// export function saveFileOnStorage(path, file, metadata) {
//   return firebase.storage().ref(path).put(file, metadata);
// }

// export function deleteFileOnStorage(path) {
//   firebase.storage().ref(path).delete();
// }

// export function getPathReference(fullPath) {
//   return firebase.storage().ref(fullPath);
// }
