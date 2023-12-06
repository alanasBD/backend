const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

const sendEmailWithNodeMail = async (emailInfo) => {
  try {
    const mailOptions = {
      from: smtpUsername,
      to: emailInfo.email,
      subject: emailInfo.subject,
      html: emailInfo.html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Message send: %s", info.message);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
module.exports = sendEmailWithNodeMail;
