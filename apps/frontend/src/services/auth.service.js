import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

import { auth } from "./firebase.js";

const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return await result.user.getIdToken();
  } catch (error) {
    console.log(error.code);

    if (
      error.code === "auth/popup-blocked" ||
      error.code === "auth/cancelled-popup-request"
    ) {
      await signInWithRedirect(auth, provider);
      return;
    }

    throw error;
  }
}

export async function handleRedirectLogin() {
  const result = await getRedirectResult(auth);

  if (!result) return null;

  return await result.user.getIdToken();
}
