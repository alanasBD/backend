const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const createJSONWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be a non-empty object.");
  }
  if (typeof secretKey !== "string" || secretKey === "") {
    throw new Error(500, "Secretkey must be a non-empty string.");
  }
  try {
    const token = jwt.sign(payload, secretKey, {
      expiresIn,
    });
    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createJSONWebToken,
};