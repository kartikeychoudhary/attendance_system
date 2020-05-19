import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import AuthReducer from "./authReducer";

export default combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  user: AuthReducer,
});
