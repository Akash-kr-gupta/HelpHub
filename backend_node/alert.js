// Alert utility for sending email and SMS notifications
const nodemailer = require('nodemailer');

// Configure nodemailer (example: Gmail, replace with your credentials or use SendGrid/Mailgun for production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL_USER,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.ALERT_EMAIL_USER,
    to,
    subject,
    text,
  };
  return transporter.sendMail(mailOptions);
}

// Example SMS via Fast2SMS (replace with your SMS API)
async function sendSMS(phone, message) {
  // Replace with your SMS API endpoint and key
  const apiKey = process.env.SMS_API_KEY;
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=v3&sender_id=TXTIND&message=${encodeURIComponent(message)}&language=english&flash=0&numbers=${phone}`;
  const res = await fetch(url);
  return res.json();
}

module.exports = { sendEmail, sendSMS };
