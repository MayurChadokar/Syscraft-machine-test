const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const testEmail = async () => {
    const targetEmail = 'piyushchadokar17@gmail.com';
    console.log(`Testing Email Configuration for target: ${targetEmail}`);
    console.log('SENDER:', process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `"Event Management Test" <${process.env.EMAIL_USER}>`,
            to: targetEmail,
            subject: "Final Verification Test",
            text: "Hi Piyush, if you are reading this, the Nodemailer integration is successful!",
        });
        console.log('✅ Success! Email sent: ' + info.messageId);
    } catch (error) {
        console.error('❌ Failed to send email:');
        console.error(error.message);
        if (error.message.includes('Application-specific password required')) {
            console.log('\n💡 SUGGESTION: Please use a Google App Password instead of your regular password.');
        }
    }
};

testEmail();
