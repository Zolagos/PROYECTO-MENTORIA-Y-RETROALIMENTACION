import ApiError from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    errors: [],
  });
};

export default errorMiddleware;
