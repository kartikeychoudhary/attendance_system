import { compose, createStore, applyMiddleware } from "redux";

import rootReducers from "./reducers";

import thunk from "redux-thunk";
import firebase from "../firebase/firebase";

// import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
// import { reduxFirestore, getFirestore } from "redux-firestore";
import { createFirestoreInstance } from "redux-firestore";

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
};

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

// const initialState = {};

export const store = createStore(
  rootReducers,
  composeEnhancers(
    applyMiddleware(thunk)
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, //since we are using Firestore
};
