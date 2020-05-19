import {
  SAVE_USER_PROFILE,
  SIGNOUT,
  SAVE_USER_STATE_TO_LOCAL_STORAGE,
} from "./types";

export const saveUserProfile = (uid, displayName, email, photoUrl) => {
  return {
    type: SAVE_USER_PROFILE,
    payload: { uid, displayName, email, photoUrl },
  };
};

export const signOut = () => {
  return {
    type: SIGNOUT,
    payload: "LOGOUT",
  };
};
