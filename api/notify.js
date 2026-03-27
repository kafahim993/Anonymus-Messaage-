export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  const BOT_TOKEN = process.env.VITE_BOT_TOKEN;
  const CHAT_ID = process.env.VITE_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Bot not configured" });
  }

  const text = `🕵️ Anonymous Message\n\n${message.trim()}`;

  try {
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }
    );

    const data = await telegramRes.json();

    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: data.description || "Telegram error" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to contact Telegram" });
  }
}
