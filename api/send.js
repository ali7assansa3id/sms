export default async function handler(req, res) {

  const allowedOrigin = "https://ali7assansa3id.github.io";

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // معالجة طلب CORS المبدئي
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method Not Allowed"
    });
  }

  try {

    const { to, from, text, category } = req.body || {};

    if (!process.env.BIRD_API_KEY) {
      return res.status(500).json({
        ok: false,
        error: "BIRD_API_KEY is not configured on Vercel."
      });
    }

    const response = await fetch(
      "https://eu1.platform.bird.com/v1/sms/messages",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${process.env.BIRD_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },

        body: JSON.stringify({
          to,
          from,
          text,
          category: category || "transactional"
        })
      }
    );

    const body = await response.text();

    let data;

    try {
      data = JSON.parse(body);
    } catch {
      data = { raw: body };
    }

    return res.status(response.status).json({
      ok: response.ok,
      status: response.status,
      bird: data
    });

  } catch (error) {

    return res.status(500).json({
      ok: false,
      error: error.message
    });

  }
}
