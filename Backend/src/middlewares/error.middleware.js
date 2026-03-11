function handleError(err, req, res, next) {
  const response = {
    message: err.message ?? "Internal Server Error",
  };

  if (process.env.NODE_ENVIRONMENT === "development") {
    response.stack = err.stack;
  }

  const status = err.status ?? 500; // 👈 fallback to 500
  res.status(status).json(response);
}

export default handleError;
