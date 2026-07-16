import auth from "../config/firebase.js";

const verifyToken = (token) => auth.verifyIdToken(token);

export default {
  verifyToken,
};
