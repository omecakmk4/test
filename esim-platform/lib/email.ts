import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error }
  }
}

export async function sendOrderConfirmationEmail(params: {
  to: string
  customerName: string
  orderNumber: string
  planName: string
  amount: number
  currency: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
        </div>
        <div class="content">
          <p>Hello ${params.customerName},</p>
          <p>Thank you for your purchase! Your eSIM order has been confirmed.</p>

          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${params.orderNumber}</p>
            <p><strong>Plan:</strong> ${params.planName}</p>
            <p><strong>Amount:</strong> ${params.amount} ${params.currency}</p>
          </div>

          <p>You will receive another email shortly with your eSIM activation details and QR code.</p>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders" class="button">View Order</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} eSIM Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: params.to,
    subject: 'Order Confirmation - eSIM Platform',
    html,
  })
}

export async function sendEsimActivationEmail(params: {
  to: string
  customerName: string
  qrCodeData: string
  smdpAddress: string
  activationCode: string
  planName: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .qr-code { text-align: center; margin: 30px 0; }
        .qr-code img { max-width: 250px; border: 4px solid #667eea; border-radius: 10px; }
        .activation-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .code { background: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 14px; word-break: break-all; }
        .steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .steps ol { padding-left: 20px; }
        .steps li { margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your eSIM is Ready!</h1>
        </div>
        <div class="content">
          <p>Hello ${params.customerName},</p>
          <p>Your eSIM for <strong>${params.planName}</strong> has been activated and is ready to use.</p>

          <div class="qr-code">
            <h3>Scan this QR Code</h3>
            <img src="${params.qrCodeData}" alt="eSIM QR Code">
          </div>

          <div class="activation-info">
            <h3>Manual Activation Details</h3>
            <p><strong>SM-DP+ Address:</strong></p>
            <div class="code">${params.smdpAddress}</div>
            <p style="margin-top: 15px;"><strong>Activation Code:</strong></p>
            <div class="code">${params.activationCode}</div>
          </div>

          <div class="steps">
            <h3>How to Install Your eSIM</h3>
            <ol>
              <li>Go to your device Settings</li>
              <li>Select "Cellular" or "Mobile Data"</li>
              <li>Tap "Add eSIM" or "Add Cellular Plan"</li>
              <li>Scan the QR code above or enter details manually</li>
              <li>Follow the on-screen instructions to complete setup</li>
            </ol>
          </div>

          <p><strong>Note:</strong> Make sure you have an active internet connection when installing your eSIM.</p>
        </div>
        <div class="footer">
          <p>Need help? Contact our support team.</p>
          <p>© ${new Date().getFullYear()} eSIM Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: params.to,
    subject: 'Your eSIM Activation Details - eSIM Platform',
    html,
  })
}

export async function sendPasswordResetEmail(params: {
  to: string
  resetLink: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>You requested to reset your password.</p>
          <p>Click the button below to reset your password:</p>

          <a href="${params.resetLink}" class="button">Reset Password</a>

          <p style="margin-top: 20px;">This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} eSIM Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: params.to,
    subject: 'Password Reset - eSIM Platform',
    html,
  })
}
