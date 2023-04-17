import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: "Nodemailer.meldziuk@gmail.com",
        pass: "qnzetlhuylyiizsx",
    }
})

export const mailOptions = {
    from: "Nodemailer.meldziuk@gmail.com",
    to: "Nodemailer.meldziuk@gmail.com"
}