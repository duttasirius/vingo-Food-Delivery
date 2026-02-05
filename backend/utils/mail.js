import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465, // 465 is the gmail port
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.pass,
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
