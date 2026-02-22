export default async function handler(req, res) {

  // Autoriser seulement POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { templateId, payload } = req.body;

    // Appel API PDFMonkey
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

    // 🔎 Lecture réponse API
    const data = await response.json();

    // 🧪 DEBUG — très important pour voir l'erreur réelle
    console.log("REPONSE COMPLETE PDFMONKEY ↓");
    console.log(JSON.stringify(data, null, 2));

    // Si PDF généré
    if (data?.document?.download_url) {
      return res.status(200).json({ url: data.document.download_url });
    }

    // Sinon erreur PDFMonkey
    return res.status(500).json({
      error: "PDF non généré",
      data: data
    });

  } catch (err) {

    console.error("ERREUR SERVEUR ↓");
    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
}