
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(to: string, message: string) {
  return client.messages.create({
    body: message,
    to,
    from: process.env.TWILIO_PHONE_NUMBER
  });
}

export async function initiateUSSD(phoneNumber: string, message: string) {
  // Implementation depends on USSD gateway provider
  console.log('USSD initiation:', { phoneNumber, message });
}
