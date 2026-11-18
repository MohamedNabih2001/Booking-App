import nodemailer from "nodemailer";
import { getEnv } from "../Utility/GetEnv";

const transporter = nodemailer.createTransport({
  host: getEnv("MAIL_HOST"),
  port: Number(getEnv("MAIL_PORT")),
  secure: false,

  auth: {
    user: getEnv("MAIL_USER"),
    pass: getEnv("MAIL_PASS"),
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const info = await transporter.sendMail({
    from: getEnv("MAIL_FROM"),
    to,
    subject,
    html,
  });

  return info;
}
