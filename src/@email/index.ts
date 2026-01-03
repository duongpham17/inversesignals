import nodemailer from 'nodemailer';

export const email_address = process.env.EMAIL_ADDRESS as string;
export const email_password = process.env.EMAIL_PASSWORD as string;

export const Email = () =>
  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user: email_address,
      pass: email_password,
    },
});