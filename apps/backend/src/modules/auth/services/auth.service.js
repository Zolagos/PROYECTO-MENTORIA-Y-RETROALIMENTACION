import firebaseService from "../../../services/firebase.service.js";

const login = async (token) => {
  return firebaseService.verifyToken(token);
};

export default {
  login,
};
