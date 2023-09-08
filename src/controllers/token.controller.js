import { Token } from '../models/token.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import createError from 'http-errors';

const { AWS_USER, AWS_PASS, AWS_SMTP, AWS_PORT } = process.env;

export const verifyEmail = (userID, email, name) => {
  // * Token verification
  let token = new Token({
    uID: userID,
    token: crypto.randomBytes(16).toString('hex')
  });
  token.save();
  if (!token) throw createError(500, 'Error saving token');

  let transporter = nodemailer.createTransport({
    service: 'AWSSES',
    host: AWS_SMTP,
    port: AWS_PORT,
    auth: {
      user: AWS_USER,
      pass: AWS_PASS
    }
  });

  let mailOptions = {
    from: "'Rob' <rob@morningafter.dev>",
    to: email,
    subject: 'Verifica tu cuenta Workea.me',
    text: `Hola ${name},\n\nPor favor verifica tu cuenta haciendo click en  \nhttp://localhost:8080/api/auth/confirmation/${token.token}\n` // ! Localhost/api is changing to the url of workeame
  };

  transporter.sendMail(mailOptions, (error, data) => {
    if (error) throw createError(500, 'Error sending email');
  });
  return `mail sent to: ${email}`;
};
