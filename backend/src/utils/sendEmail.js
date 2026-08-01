const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Basic setup using a fallback Ethereal host for local dev if environment variables are missing
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_EMAIL || 'dummy@ethereal.email',
            pass: process.env.SMTP_PASSWORD || 'dummy_password'
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Lumina'} <${process.env.FROM_EMAIL || 'noreply@lumina.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
    } catch (err) {
        console.log('Error sending email:', err.message);
        console.log('Fallback: Here is the reset link ->', options.message);
        // We log the link so the developer can still click it in the terminal
    }
};

module.exports = sendEmail;
