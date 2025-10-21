 ,,,js
   require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Read module test log
const logFile = path.join(__dirname, 'moduleTest.log'); // Make sure moduleTest.js writes to this file
const logContent = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf-8') : 'No log found.';

// Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

// Email options
const mailOptions = {
  from: process.env.APP_EMAIL,
  to: 'qonexaihelpcenter@gmail.com',
  subject: 'QonexAI Module Test Result',
  text: logContent
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Failed to send email:', error.message);
  } else {
    console.log('✅ Test result email sent:', info.response);
  }
});
