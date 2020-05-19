import { SAVE_USER_STATE_TO_LOCAL_STORAGE } from "./types";

export const saveUserStateToLocalStorage = () => {
  return {
    type: SAVE_USER_STATE_TO_LOCAL_STORAGE,
    payload: "SAVE TO LOCAL STORAGE",
  };
};
