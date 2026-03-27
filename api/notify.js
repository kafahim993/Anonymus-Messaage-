export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    const BOT_TOKEN = process.env.VITE_BOT_TOKEN;
    const CHAT_ID = process.env.VITE_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        success: false,
        error: "Bot not configured",
      });
    }

    // 🔥 Get IP address
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "Unknown";

    const text = `🕵️ Anonymous Message

${message.trim()}

🌐 IP: ${ip}`;

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
        }),
      }
    );

    const data = await telegramRes.json();

    if (!data.ok) {
      return res.status(400).json({
        success: false,
        error: data.description || "Telegram error",
      });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
}
