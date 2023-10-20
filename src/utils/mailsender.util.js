import nodemailer from 'nodemailer';
import createError from 'http-errors';

const { AWS_SMTP, AWS_PORT, AWS_USER, AWS_PASS } = process.env;
const { WORKEA_MAIL, WORKEA_VERIFICATION_SUBJECT } = process.env;

export function sendMail(email, text, subject) {
  const transporter = nodemailer.createTransport({
    host: AWS_SMTP,
    port: AWS_PORT,
    secure: false,
    auth: {
      user: AWS_USER,
      pass: AWS_PASS
    }
  });
  transporter.sendMail(
    {
      from: WORKEA_MAIL,
      to: email,
      subject: subject || WORKEA_VERIFICATION_SUBJECT,
      text: text
    },
    (error) => {
      if (error) {
        throw createError(400, 'Error sending email');
      }
    }
  );
}
