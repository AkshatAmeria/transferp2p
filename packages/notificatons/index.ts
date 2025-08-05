import twilio from "twilio";

// Create Twilio client using environment variables
const client = twilio(
  process.env.TWILIO_SID!,
  process.env.TWILIO_AUTH!
);

export async function sendSMS(to: string, message: string) {
  try {
    const msg = await client.messages.create({
      body: message,
      from: process.env.TWILIO_NUMBER!,
      to, // e.g. +91XXXXXXXXXX
    });
    console.log("✅ SMS Sent:", msg.sid);
    return msg.sid;
  } catch (error) {
    console.error("❌ SMS Error:", error);
    throw error;
  }
}
