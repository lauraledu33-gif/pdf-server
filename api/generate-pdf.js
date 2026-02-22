export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { templateId, payload } = req.body;

    console.log("DATA RECUE CANVA ↓");
    console.log(templateId);
    console.log(payload);

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

    console.log("REPONSE COMPLETE PDFMONKEY ↓");
    console.log(JSON.stringify(data, null, 2));

    if (data?.document?.download_url) {
      return res.status(200).json({ url: data.document.download_url });
    }

    return res.status(500).json({
      error: "PDF non généré",
      pdfmonkey_response: data
    });

  } catch (err) {
    console.log("ERREUR SERVEUR ↓");
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
}