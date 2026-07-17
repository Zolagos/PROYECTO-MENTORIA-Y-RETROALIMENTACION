import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import { findAuthByEmail } from "../repositories/users.repository.js";

const login = async (email, password) => {
  const user = await findAuthByEmail(email);

  if (!user || !user.status) {
    throw new ApiError("Invalid credentials", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new ApiError("Invalid credentials", 401);
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    lastname: user.lastname,
    role: user.role,
    clanId: user.clan_id,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return { token, user: payload };
};

const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);

export default {
  login,
  verifyToken,
};
