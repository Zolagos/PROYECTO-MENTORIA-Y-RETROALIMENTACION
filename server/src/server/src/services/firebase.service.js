import auth from "../config/firebase.js";

const verifyToken = async (token) => {
  return await auth.verifyIdToken(token);
};

export default {
  verifyToken,
};
