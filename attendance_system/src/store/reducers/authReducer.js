import firebase from "../../firebase/firebase";

import {
  SAVE_USER_PROFILE,
  SIGNOUT,
  GET_CURRENT_USER,
  SAVE_USER_STATE_TO_LOCAL_STORAGE,
} from "../actions/types";

const INITIAL_STATE =
  localStorage.getItem("UserState") !== "Logout"
    ? JSON.parse(localStorage.getItem("userState"))
    : {
        profile: {
          displayName: "",
          photoUrl: "",
          email: "",
        },
        uid: "",
        error: "",
        loading: false,
        type: undefined,
      };

const AuthReducer = (state = INITIAL_STATE, action) => {
  // console.log("ACTION", action);
  switch (action.type) {
    case SAVE_USER_PROFILE:
      return {
        ...state,
        uid: action.payload.uid,
        profile: {
          displayName: action.payload.displayName,
          photoUrl: action.payload.photoUrl,
          email: action.payload.email,
        },
      };
    case SAVE_USER_STATE_TO_LOCAL_STORAGE:
      console.log(state);
      localStorage.setItem("UserState", JSON.stringify(state));
      return {
        ...state,
      };
    case SIGNOUT:
      firebase
        .auth()
        .signOut()
        .then(() => {
          return {
            ...state,
            uid: action.payload,
          };
        });
    default:
      return state;
  }
};

export default AuthReducer;
