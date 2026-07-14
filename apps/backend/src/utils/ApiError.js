class ApiError extends Error {
  constructor(message, status = 500, errors = []) {
    super(message);

    this.status = status;
    this.errors = errors;
    this.success = false;
  }
}

export default ApiError;
