const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_SERVICE_USER,
                pass: process.env.EMAIL_SERVICE_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"True Feedback" <${process.env.EMAIL_SERVICE_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html
        });

        console.log("Message sent: ", info);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
}

module.exports = sendEmail;