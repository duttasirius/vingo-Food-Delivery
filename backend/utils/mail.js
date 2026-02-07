import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// to -from the sending mail from my side(ex-testwork845@gmail.com) , Otp - user side getting OTP

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset Your Password",
    html: `
  <p style="font-size:16px; color:#333;">
    Your One-Time Password (OTP) for resetting your password is:
    <strong style="font-size:18px; color:#ff4d2d;">${otp}</strong>
  </p>
  <p style="font-size:14px; color:#666;">
    This OTP is valid for the next 10 minutes. Please do not share it with anyone.
  </p>
`,
  });
};
