const errorResponse = (
  res,
  { statusCode = 500, message = "Internal server error" }
) => {
  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

const successResponse = (
  res,
  { statusCode = 200, message = "Success", payload = {} }
) => {
  res.status(statusCode).json({
    success: true,
    message,
    payload,
  });
};

module.exports = {
  errorResponse,
  successResponse,
};
