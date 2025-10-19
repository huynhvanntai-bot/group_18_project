// SV3: Email Service với Nodemailer - nguyenquocvinh
// Cấu hình Gmail SMTP để gửi email reset password thật

const nodemailer = require("nodemailer");

// Tạo transporter cho Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Gmail của bạn
      pass: process.env.EMAIL_PASS  // App Password của Gmail
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Test kết nối email
const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email service ready - Gmail SMTP connected");
    return true;
  } catch (error) {
    console.error("❌ Email service error:", error.message);
    return false;
  }
};

// Gửi email reset password
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const transporter = createTransporter();

    // Frontend URL để reset password
    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // HTML template cho email
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Password - RBAC System</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(45deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: linear-gradient(45deg, #5a6fd8, #6a4190); }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .token-info { background: #e3f2fd; border: 1px solid #bbdefb; color: #1565c0; padding: 15px; border-radius: 5px; margin: 20px 0; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
            <p>RBAC System - Password Recovery</p>
          </div>
          
          <div class="content">
            <h2>Hello ${userName || 'User'}! 👋</h2>
            
            <p>We received a request to reset your password for your RBAC System account.</p>
            
            <p>If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetURL}" class="button">🔄 Reset Password</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in <strong>1 hour</strong></li>
                <li>You can only use this link once</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>
            
            <div class="token-info">
              <strong>🔑 Reset Token:</strong><br>
              <code>${resetToken}</code><br>
              <small>You can also copy this token manually if the link doesn't work</small>
            </div>
            
            <h3>📧 Account Information:</h3>
            <ul>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Request Time:</strong> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</li>
              <li><strong>IP:</strong> Request from your account</li>
            </ul>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px;">
              <a href="${resetURL}">${resetURL}</a>
            </p>
          </div>
          
          <div class="footer">
            <p><strong>RBAC System - Group 18</strong></p>
            <p>📍 HCMUS - DH22TIN04</p>
            <p>👥 Team: huynhvantai, phamquanghuy1661, nguyenquocvinh</p>
            <p>⏰ This email was sent automatically. Please do not reply.</p>
            
            <hr style="margin: 20px 0;">
            
            <p style="font-size: 12px; color: #999;">
              🔒 <strong>Security Tips:</strong><br>
              • Never share your password with anyone<br>
              • Use a strong, unique password<br>
              • Enable two-factor authentication if available<br>
              • If you didn't request this reset, contact admin immediately
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const textTemplate = `
🔐 RBAC System - Password Reset Request

Hello ${userName || 'User'}!

We received a request to reset your password for your RBAC System account.

Reset Link: ${resetURL}

Reset Token: ${resetToken}

⚠️ IMPORTANT:
- This link expires in 1 hour
- Can only be used once
- If you didn't request this, ignore this email

Account: ${email}
Time: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}

---
RBAC System - Group 18
HCMUS - DH22TIN04
Team: huynhvantai, phamquanghuy1661, nguyenquocvinh
    `;

    // Email options
    const mailOptions = {
      from: {
        name: 'RBAC System - Group 18',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🔐 Reset Your Password - RBAC System',
      text: textTemplate,
      html: htmlTemplate,
      // Email headers
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    // Gửi email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Password reset email sent successfully");
    console.log("📧 Message ID:", info.messageId);
    console.log("👤 Sent to:", email);
    console.log("🔗 Reset URL:", resetURL);

    return {
      success: true,
      messageId: info.messageId,
      resetURL: resetURL,
      to: email
    };

  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// Gửi email xác nhận password đã được reset thành công
const sendPasswordResetConfirmationEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset Successful - RBAC System</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Password Reset Successful</h1>
            <p>RBAC System - Security Notification</p>
          </div>
          
          <div class="content">
            <h2>Hello ${userName || 'User'}! 👋</h2>
            
            <div class="success">
              <strong>🎉 Success!</strong> Your password has been reset successfully.
            </div>
            
            <p>Your RBAC System account password has been changed successfully.</p>
            
            <h3>📋 Reset Details:</h3>
            <ul>
              <li><strong>Account:</strong> ${email}</li>
              <li><strong>Reset Time:</strong> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</li>
              <li><strong>Status:</strong> ✅ Completed</li>
            </ul>
            
            <p>🔒 <strong>Security Reminder:</strong></p>
            <ul>
              <li>Keep your new password secure</li>
              <li>Don't share it with anyone</li>
              <li>Log in with your new password</li>
            </ul>
            
            <p>If you didn't make this change, please contact our admin team immediately.</p>
          </div>
          
          <div class="footer">
            <p><strong>RBAC System - Group 18</strong></p>
            <p>📍 HCMUS - DH22TIN04</p>
            <p>👥 Team: huynhvantai, phamquanghuy1661, nguyenquocvinh</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: {
        name: 'RBAC System - Group 18',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '✅ Password Reset Successful - RBAC System',
      html: htmlTemplate
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset confirmation email sent:", info.messageId);

    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("❌ Failed to send confirmation email:", error);
    throw error;
  }
};

module.exports = {
  testEmailConnection,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail
};