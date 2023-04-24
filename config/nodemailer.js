import nodemailer from "nodemailer";
import { env } from "process";

const NODEMAILER_EMAIL = env.NODEMAILER_EMAIL;
const NODEMAILER_PASSWORD = env.NODEMAILER_PASSWORD;

export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: NODEMAILER_EMAIL,
        pass: NODEMAILER_PASSWORD,
    }
})

export const mailOptions = {
    from: NODEMAILER_EMAIL,
    to: NODEMAILER_EMAIL
}