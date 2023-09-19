const nodemailer = require('nodemailer');

const nodeMailerHandler = {
    sendMail: () => {
        const transporter = nodemailer.createTransport({
            host: process.env.NODEMAILER_HOST,
            port: process.env.NODEMAILER_PORT,
            secure: process.env.NODEMAILER_SECURE,
            auth: {
                user: process.env.NODEMAILER_AUTH_USERNAME,
                pass: process.env.NODEMAILER_AUTH_PASSWROD,
            },
        });

        const options = {
            from: process.env.NODEMAILER_AUTH_USERNAME,
            to: to,
            subject: subject,
            html: htmlContent,
        };

        return transporter.sendMail(options);
    },
};

module.exports = nodeMailerHandler;
