import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

export const sendVerificationEmail = async (to, token) => {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false, // true nếu dùng 465, false nếu 587
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  })

  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`

  const mailOptions = {
    from: `"Trello Web" <${env.SMTP_USER}>`,
    to,
    subject: 'Verify your email',
    html: `
      <h2>Welcome to Trello Web 🎉</h2>
      <p>Please click the link below to verify your email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  }

  await transporter.sendMail(mailOptions)
}
