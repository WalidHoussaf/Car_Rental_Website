import nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // Check if real email credentials are configured
  const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_HOST;
  
  if (hasEmailConfig) {
    return createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    return createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'test@ethereal.email',
        pass: 'test'
      }
    });
  }
};

// Email templates
const emailTemplates = {
  verification: (userName, verificationLink) => ({
    subject: 'Verify Your Email - RENT MY RIDE',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * {
            font-family: 'Trebuchet MS', sans-serif !important;
          }
          body {
            font-family: 'Trebuchet MS', sans-serif;
            line-height: 1.6;
            color: #e0e0e0;
            background-color: #000000;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 212, 255, 0.15);
            border: 1px solid rgba(34, 211, 238, 0.2);
          }
          .header {
            background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%);
            border-bottom: 2px solid rgba(34, 211, 238, 0.3);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
          }
          .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #22d3ee, transparent);
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 900;
            background: linear-gradient(135deg, #ffffff 0%, #22d3ee 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 2px;
          }
          .logo {
            width: 180px;
            height: auto;
            margin-bottom: 20px;
          }
          .content {
            padding: 40px 30px;
            background: #0a0a0a;
          }
          .content h2 {
            color: #22d3ee;
            margin-top: 0;
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
          }
          .content p {
            color: #d1d5db;
            font-size: 15px;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            padding: 16px 48px;
            background: linear-gradient(135deg, #22d3ee 0%, #0891b2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 16px rgba(34, 211, 238, 0.4);
            transition: all 0.3s ease;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(34, 211, 238, 0.6);
          }
          .warning {
            background: rgba(251, 191, 36, 0.1);
            border: 1px solid rgba(251, 191, 36, 0.3);
            border-left: 4px solid #fbbf24;
            padding: 16px;
            margin: 25px 0;
            border-radius: 6px;
          }
          .warning strong {
            color: #fbbf24;
            font-size: 16px;
          }
          .warning p {
            margin: 5px 0 0 0;
            color: #d1d5db;
          }
          .link-box {
            background: rgba(34, 211, 238, 0.05);
            border: 1px solid rgba(34, 211, 238, 0.2);
            padding: 15px;
            margin: 20px 0;
            border-radius: 6px;
          }
          .link-text {
            word-break: break-all;
            color: #22d3ee;
            font-size: 12px;
            font-family: monospace;
          }
          .footer {
            background: #000000;
            border-top: 1px solid rgba(34, 211, 238, 0.2);
            padding: 25px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
          .footer strong {
            color: #22d3ee;
            font-size: 14px;
            letter-spacing: 1px;
          }
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent);
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://raw.githubusercontent.com/WalidHoussaf/Car_Rental_Website/main/frontend/src/assets/logo.png" class="logo" alt="RENT MY RIDE Logo" />
            <h1>RENT MY RIDE</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${userName}!</h2>
            <p>Thank you for joining <strong style="color: #22d3ee;">RENT MY RIDE</strong>. We're excited to have you on board!</p>
            <p>To unlock your account and start booking premium vehicles, please verify your email address by clicking the button below:</p>
            
            <div class="button-container">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            
            <div class="warning">
              <strong>⏰ Important Notice</strong>
              <p>This verification link will expire in 24 hours for security purposes.</p>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 13px; color: #9ca3af;">If the button doesn't work, copy and paste this link into your browser:</p>
            <div class="link-box">
              <div class="link-text">${verificationLink}</div>
            </div>
            
            <div class="divider"></div>
            
            <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p><strong>RENT MY RIDE</strong></p>
            <p style="margin: 10px 0;">Premium Car Rental Platform</p>
            <p style="margin: 5px 0;">This is an automated email. Please do not reply to this message.</p>
            <p style="margin-top: 15px;">&copy; ${new Date().getFullYear()} RENT MY RIDE. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Car Rental Platform!
      
      Hi ${userName},
      
      Thank you for registering with us. To complete your registration, please verify your email address by clicking the link below:
      
      ${verificationLink}
      
      This link will expire in 24 hours.
      
      If you didn't create an account, please ignore this email.
      
      Best regards,
      Car Rental Platform Team
    `
  }),

  verificationSuccess: (userName) => ({
    subject: 'Email Verified - Welcome to RENT MY RIDE!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * {
            font-family: 'Trebuchet MS', sans-serif !important;
          }
          body {
            font-family: 'Trebuchet MS', sans-serif;
            line-height: 1.6;
            color: #e0e0e0;
            background-color: #000000;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(34, 211, 238, 0.15);
            border: 1px solid rgba(34, 211, 238, 0.2);
          }
          .header {
            background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%);
            border-bottom: 2px solid rgba(34, 211, 238, 0.3);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
          }
          .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #22d3ee, transparent);
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 900;
            background: linear-gradient(135deg, #ffffff 0%, #22d3ee 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 2px;
          }
          .logo {
            width: 180px;
            height: auto;
            margin-bottom: 20px;
          }
          .content {
            padding: 40px 30px;
            background: #0a0a0a;
          }
          .content h2 {
            color: #22d3ee;
            margin-top: 0;
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
          }
          .content p {
            color: #d1d5db;
            font-size: 15px;
          }
          .success-badge {
            display: inline-block;
            background: linear-gradient(135deg, #22d3ee 0%, #0891b2 100%);
            color: #000000;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            padding: 16px 48px;
            background: linear-gradient(135deg, #22d3ee 0%, #0891b2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 16px rgba(34, 211, 238, 0.4);
            transition: all 0.3s ease;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(34, 211, 238, 0.6);
          }
          .features {
            background: rgba(34, 211, 238, 0.05);
            border: 1px solid rgba(34, 211, 238, 0.2);
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: left;
          }
          .features ul {
            list-style: none;
            padding: 0;
            margin: 10px 0;
          }
          .features li {
            padding: 8px 0;
            color: #d1d5db;
            font-size: 14px;
          }
          .features li:before {
            content: '✓';
            color: #22d3ee;
            font-weight: bold;
            margin-right: 10px;
            font-size: 18px;
          }
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent);
            margin: 20px 0;
          }
          .footer {
            background: #000000;
            border-top: 1px solid rgba(34, 211, 238, 0.2);
            padding: 25px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
          .footer strong {
            color: #22d3ee;
            font-size: 14px;
            letter-spacing: 1px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://raw.githubusercontent.com/WalidHoussaf/Car_Rental_Website/main/frontend/src/assets/logo.png" class="logo" alt="RENT MY RIDE Logo" />
            <h1>RENT MY RIDE</h1>
          </div>
          <div class="content">
            <div style="text-align: center;">
              <span class="success-badge">✓ Email Verified Successfully</span>
            </div>
            <h2>Welcome Aboard, ${userName}!</h2>
            <p>Your email has been verified successfully. You now have full access to <strong style="color: #22d3ee;">RENT MY RIDE</strong> premium platform!</p>
            
            <div class="divider"></div>
            
            <div class="features">
              <p style="color: #22d3ee; font-weight: bold; margin-bottom: 10px;">You can now:</p>
              <ul>
                <li>Browse our extensive fleet of premium vehicles</li>
                <li>Make instant bookings 24/7</li>
                <li>Manage your reservations online</li>
                <li>Access exclusive deals and offers</li>
              </ul>
            </div>
            
            <div class="button-container">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/cars" class="button">Start Browsing Cars</a>
            </div>
            
            <div class="divider"></div>
            
            <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">Thank you for choosing RENT MY RIDE!</p>
          </div>
          <div class="footer">
            <p><strong>RENT MY RIDE</strong></p>
            <p style="margin: 10px 0;">Premium Car Rental Platform</p>
            <p style="margin-top: 15px;">&copy; ${new Date().getFullYear()} RENT MY RIDE. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Email Verified Successfully!
      
      Hi ${userName},
      
      Your email has been verified successfully. You now have full access to our platform!
      
      Start browsing our cars at: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/cars
      
      Best regards,
      Car Rental Platform Team
    `
  })
};

// Send verification email
export const sendVerificationEmail = async (email, userName, verificationToken) => {
  try {
    const transporter = createTransporter();
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    
    const template = emailTemplates.verification(userName, verificationLink);
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Rent My Ride" <rentmyride@gmail.com>',
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html
    });


    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send verification success email
export const sendVerificationSuccessEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates.verificationSuccess(userName);
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Rent My Ride" <rentmyride@gmail.com>',
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html
    });


    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Error sending success email:', error);
    // Don't throw error for success email - it's not critical
    return { success: false };
  }
};

export default {
  sendVerificationEmail,
  sendVerificationSuccessEmail
};
