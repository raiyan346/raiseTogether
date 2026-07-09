import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER) {
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: 'Verify your RiseTogether account',
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px;background:#000;color:#fff;border-radius:12px">
      <h1 style="color:#fff">Welcome to RiseTogether</h1>
      <p>Click the button below to verify your email address.</p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#fff;color:#000;text-decoration:none;border-radius:8px;font-weight:600;margin:20px 0">Verify Email</a>
      <p style="color:#888;font-size:14px">This link expires in 24 hours.</p>
    </div>`,
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: 'Reset your RiseTogether password',
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px;background:#000;color:#fff;border-radius:12px">
      <h1>Password Reset</h1>
      <p>Click below to reset your password.</p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#fff;color:#000;text-decoration:none;border-radius:8px;font-weight:600">Reset Password</a>
      <p style="color:#888;font-size:14px">Expires in 1 hour. If you didn't request this, ignore this email.</p>
    </div>`,
  });
};
