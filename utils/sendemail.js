const nodemailer = require('nodemailer');
const { SMTPHost, SMTPPort, SMTPEmail, SMTPPassword, fromName, fromEmail } = require('../config/config');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: SMTPHost,
    port: SMTPPort,
    auth: {
      user: SMTPEmail,
      pass: SMTPPassword,
    },
  });

  const message = {
    from: `${fromName} <${fromEmail}>`,
    to: options.email,
    subject: options.subject, 
    text: options.message, // 'Hello World?'
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;

