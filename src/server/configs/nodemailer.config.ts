import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTP=async (to: String, OTP: Number)=>{
    const info=await transporter.sendMail({
        from:process.env.SMTP_HOST,
        to:to,
        text:`Your OTP for email verification is ${OTP}.`
    });
    console.log(info);
}