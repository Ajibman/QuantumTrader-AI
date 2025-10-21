import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load EMAIL_USER and EMAIL_PASSWORD from .env

async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Quantum Trader AI Test" <${process.env.EMAIL_USER}>`,
      to: "ajibulurobotman@gmail.com", // You can change this to any target
      subject: "✅ Quantum Trader AI Test Email",
      text: "Hello from QT AI! This is a test email sent via secure configuration.",
      html: "<b>Hello from QT AI!</b><br>This is a test email sent via secure configuration.",
    });

    console.log("✅ Test email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending test email:", error);
  }
}

sendTestEmail();
