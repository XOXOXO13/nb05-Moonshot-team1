import * as dotenv from "dotenv";
import * as nodemailer from "nodemailer";
dotenv.config();

const { SMTP_SERVICE, SMTP_USER_NAME, SMTP_USER_PASSWORD } = process.env;

export const smtpConfig: nodemailer.TransportOptions = {
  service: SMTP_SERVICE,
  auth: {
    user: SMTP_USER_NAME,
    pass: SMTP_USER_PASSWORD,
  },
} as nodemailer.TransportOptions;
