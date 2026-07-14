import admin from "../config/firebase.js";

const verifyToken = async (token) => {
  return await admin.auth().verifyIdToken(token);
};

export default {
  verifyToken,
};
