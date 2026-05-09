const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        console.log(`Attempting to send email to: ${options.email}`);
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"EventHub" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
            attachments: options.attachments || [],
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Nodemailer Error Details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            host: process.env.EMAIL_HOST,
            user: process.env.EMAIL_USER
        });
        throw error;
    }
};

module.exports = sendEmail;
