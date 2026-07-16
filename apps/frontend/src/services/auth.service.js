import {
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";

import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {

    const result = await signInWithPopup(auth, provider);

    const token = await result.user.getIdToken();

    return token;
}
