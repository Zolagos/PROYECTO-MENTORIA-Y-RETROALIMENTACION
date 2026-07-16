const validateLogin = (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required",
    });
  }

  if (typeof token !== "string") {
    return res.status(400).json({
      success: false,
      message: "Token must be a string",
    });
  }

  next();
};

export default {
  validateLogin,
};
