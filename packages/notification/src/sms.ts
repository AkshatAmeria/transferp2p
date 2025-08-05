import twilio from "twilio";



const client = twilio(
  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
);

/**
 * Send SMS using Twilio
 * @param to Receiver phone number in E.164 format (+91 for India)
 * @param message Text message to send
 */
export async function sendSMS(to: string, message: string): Promise<void> {


  try {
    await client.messages.create({
      body: message,
      from: "+19035468041",
      to,
    });

    console.log(`✅ SMS sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send SMS:", error);
    throw error; 
  }
}
