require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 5000;
const mongodbURL = process.env.MONGODB_ATLAS_URL;
const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.png";

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "5223623623fsdafsa";

const smtpUsername = process.env.SMTP_USER_NAME;
const smtpPassword = process.env.SMTP_PASSWORD;

const clientUrl = process.env.CLIENT_URL;

module.exports = {
  serverPort,
  mongodbURL,
  defaultImagePath,
  jwtActivationKey,
  smtpUsername,
  smtpPassword,
  clientUrl,
};
