import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  from: any;
  to: string;
  subject: string;
  text: string;
}


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail({ from, to, subject, text }: EmailOptions): Promise<void> {
  console.log('The from email:', from);
  
  const mailOptions : any = {
    from,
    to,
    subject, 
    text,
  };

  try {
    console.log('Sending email with options:', mailOptions);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}
