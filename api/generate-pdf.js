export default async function handler(req, res) {

  // ✅ autoriser CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ répondre à la requête OPTIONS (pré-vérification Canva)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ autoriser uniquement POST ensuite
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { templateId, payload } = req.body;

    const response = await fetch("https://api.pdfmonkey.io/api/v1/documents", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.PDFMONKEY_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        document: {
          document_template_id: templateId,
          payload: payload
        }
      })
    });

    const data = await response.json();

    if (data?.document?.download_url) {
      return res.status(200).json({ url: data.document.download_url });
    } else {
      return res.status(500).json({ error: "PDF non généré", data });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}