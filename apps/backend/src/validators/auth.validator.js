const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "A valid email is required",
    });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  next();
};

export default {
  validateLogin,
};
