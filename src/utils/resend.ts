import { Resend } from 'resend';
require('dotenv').config();

export const resend = new Resend(process.env.RESEND_API_KEY);

export type sendMailProps = {
  receiverEmail: string;
  subject: string;
  userId: string;
  templateMail?: 'activation' | 'forgotPassword';
};

export const sendEmail = async (data: sendMailProps) => {
  const verificationLink = `${process.env.NEXT_API_URL}/users/activation/${data.userId}`;
  try {
    const result = await resend.emails.send({
      from: 'CaffinatedApp <caffinated@resend.dev>',
      to: [data.receiverEmail],
      subject: data.subject,
      html: `<div><h2>Email Verification</h2><p>Dear User,</p><p>Thank you for registering. Please click the link below to verify your email address:</p><a href=${verificationLink}>Verify Email</a><p>If you didnt request this verification, please ignore this email.</p><p>Best regards,<br>Your Company Name</p></div>`,
    });
    console.log('Verification email send: ', result);
  } catch (error) {
    throw new Error('Failed to send email');
  }
};
