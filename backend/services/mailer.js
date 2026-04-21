import nodemailer from 'nodemailer';
import 'dotenv/config';

// Initialize transporter
// For local testing without SMTP credentials, it simply logs to console.
const getTransporter = () => {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return null;
};

const transporter = getTransporter();

export const sendDeadManSwitchAlert = async (userName, executorEmail, beneficiariesCount) => {
    const subject = `URGENT: Dead Man's Switch Triggered for ${userName}`;
    const text = `
Hello,

This is an automated alert from Inheritance OS. 

The Dead Man's Switch for ${userName} has been triggered due to prolonged inactivity exceeding their set threshold.

As the designated executor, you are being notified that ${beneficiariesCount} AI-generated farewell letters and asset allocations are now being prepared for release to the respective beneficiaries.

Please log into the estate portal or contact the designated legal representative to proceed with the execution of the estate.

Regards,
Inheritance OS Automated System
    `.trim();

    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"Inheritance OS" <${process.env.SMTP_USER}>`,
                to: executorEmail,
                subject,
                text,
            });
            console.log(`✅ Alert email successfully sent to executor: ${executorEmail}`);
        } catch (error) {
            console.error(`❌ Failed to send email to ${executorEmail}:`, error);
        }
    } else {
        console.log('\n[SIMULATED EMAIL - NO SMTP CREDENTIALS PROVIDED]');
        console.log('--------------------------------------------------');
        console.log(`To: ${executorEmail}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body:\n${text}`);
        console.log('--------------------------------------------------\n');
    }
};
