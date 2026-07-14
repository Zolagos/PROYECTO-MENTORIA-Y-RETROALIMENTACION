import firebaseService from "../../../services/firebase.service.js";

const login = async (token) => {
  const decodedToken = await firebaseService.verifyToken(token);

  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
  };
};

export default {
  login,
};
