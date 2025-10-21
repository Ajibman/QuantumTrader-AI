require('dotenv').config();
const nodemailer = require('nodemailer');

// Use the HelpCenter email for sending
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

// Example test email
const mailOptions = {
  from: process.env.APP_EMAIL,
  to: 'recipient@example.com', // Replace with your test email
  subject: 'QonexAI Test Email',
  text: 'This is a test email from QonexAI app.'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});
