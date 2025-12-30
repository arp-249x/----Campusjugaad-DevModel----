import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const sendNewQuestNotification = async (questTitle: string, reward: number) => {
  // 1. THE ADMIN SWITCH: If this is false, stop immediately.
  if (process.env.ENABLE_NOTIFICATIONS !== 'true') {
    console.log("🚫 Notifications are disabled. Skipping.");
    return;
  }

  const options = {
    method: 'POST',
    url: 'https://onesignal.com/api/v1/notifications',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}` // Secure Server-Side Key
    },
    data: {
      app_id: process.env.ONESIGNAL_APP_ID,
      headings: { en: "New Quest Available!" },
      contents: { en: `Someone needs help: "${questTitle}" for ₹${reward}` },
      included_segments: ["All"], // Sends to everyone subscribed
      // url: "https://your-app-url.com" // Optional: Link to open when clicked
    }
  };

  try {
    await axios.request(options);
    console.log("✅ Push notification sent via OneSignal");
  } catch (error) {
    console.error("❌ Notification failed:", error);
  }
};