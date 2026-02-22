export default async function handler(req, res) {

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

    const url =
      data?.document?.public_url ||
      data?.document?.download_url;

    if (url) {
      return res.status(200).json({ url });
    } else {
      return res.status(500).json({
        error: "PDF non généré",
        pdfmonkey_response: data
      });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}