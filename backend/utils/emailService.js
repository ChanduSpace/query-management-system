const nodemailer = require("nodemailer");
const emailTemplates = require("./emailTemplates");

// FIX: Changed createTransporter to createTransport
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const sendQueryAcknowledgement = async (query) => {
  const template = emailTemplates.queryReceived(query);
  return await sendEmail(query.customerEmail, template.subject, template.html);
};

const sendQueryUpdate = async (query, updateMessage) => {
  const template = emailTemplates.queryUpdated(query, updateMessage);
  return await sendEmail(query.customerEmail, template.subject, template.html);
};

const sendQueryResolution = async (query) => {
  const template = emailTemplates.queryResolved(query);
  return await sendEmail(query.customerEmail, template.subject, template.html);
};

module.exports = {
  sendEmail,
  sendQueryAcknowledgement,
  sendQueryUpdate,
  sendQueryResolution,
};
