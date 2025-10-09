const SibApiV3Sdk = require('sib-api-v3-sdk')
const defaultClient = SibApiV3Sdk.ApiClient.instance

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = process.env.BREVO_API_KEY

const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi()

export async function sendOTPEmail(email, firstName, otp) {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    sendSmtpEmail.sender = {
      email: process.env.BREVO_FROM_EMAIL || 'noreply@yourchurch.com',
      name: process.env.BREVO_FROM_NAME || 'Immaculate Conception Catholic Church'
    }
    
    sendSmtpEmail.to = [{ email }]
    sendSmtpEmail.subject = 'Verify Your Email - Immaculate Conception Catholic Church'
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #faf9f7; }
          .header { background: linear-gradient(135deg, #2c3e50 0%, #4a6b8a 100%); color: white; padding: 30px; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #e8e5dd; }
          .otp-code { background: #f8f6f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; border: 1px solid #e8e5dd; }
          .code { font-size: 2.5rem; font-weight: bold; color: #2c3e50; letter-spacing: 8px; }
          .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e8e5dd; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Immaculate Conception Catholic Church</h1>
            <p style="margin: 10px 0 0 0; font-style: italic; opacity: 0.9;">Email Verification</p>
          </div>
          <div class="content">
            <h2 style="color: #2c3e50;">Hello ${firstName},</h2>
            <p>Thank you for registering with our church community. Please use the verification code below to complete your registration:</p>
            
            <div class="otp-code">
              <div class="code">${otp}</div>
              <p style="color: #666; margin: 10px 0 0 0;">This code will expire in 10 minutes</p>
            </div>

            <p>If you didn't request this code, please ignore this email.</p>
            
            <p style="font-style: italic; color: #5d6d7e;">
              "For where two or three gather in my name, there am I with them." - Matthew 18:20
            </p>
          </div>
          <div class="footer">
            <p><strong>Immaculate Conception Catholic Church</strong><br>
            123 Church Street, Your City, State 12345</p>
          </div>
        </div>
      </body>
      </html>
    `

    const result = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail)
    console.log('OTP email sent successfully:', result.messageId)
    return result

  } catch (error) {
    console.error('Error sending OTP email:', error)
    throw new Error(`Failed to send OTP email: ${error.message}`)
  }
}