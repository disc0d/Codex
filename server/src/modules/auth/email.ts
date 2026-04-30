import { env } from '../../config/env.js';

export const sendVerificationEmail = async (email: string, verificationUrl: string): Promise<void> => {
  if (!env.SENDGRID_API_KEY) {
    if (env.NODE_ENV !== 'production') {
      console.log(`Verification URL for ${email}: ${verificationUrl}`);
    }
    return;
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: env.EMAIL_FROM },
      subject: 'Verify your OpsPulse account',
      content: [{ type: 'text/plain', value: `Verify your account: ${verificationUrl}` }]
    })
  });

  if (!response.ok) throw new Error(`Email delivery failed: ${response.status}`);
};
