export default async function handler(req, res) {

  // =========================================
  // ✅ CORS OBLIGATOIRE POUR CANVA IFRAME
  // =========================================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Canva envoie une requête preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Sécurité méthode
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    // =========================================
    // 📦 DATA ENVOYÉE PAR CANVA
    // =========================================
    const { templateId, payload } = req.body;

    if (!templateId) {
      return res.status(400).json({ error: "templateId manquant" });
    }

    // =========================================
    // 📄 APPEL API PDFMONKEY
    // =========================================
    const response = await fetch("https://api.pdfmonkey.io/api/v1/documents", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.PDFMONKEY_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        document: {
          document_template_id: templateId,
          payload: payload || {}
        }
      })
    });

    const data = await response.json();

    // =========================================
    // 🧠 DEBUG SERVEUR (visible dans logs Vercel)
    // =========================================
    console.log("REPONSE PDFMONKEY ↓");
    console.log(JSON.stringify(data, null, 2));

    // =========================================
    // ✅ SI PDF OK
    // =========================================
    if (data?.document?.download_url) {
      return res.status(200).json({
        success: true,
        url: data.document.download_url
      });
    }

    // =========================================
    // ❌ SI ERREUR PDFMONKEY
    // =========================================
    return res.status(500).json({
      error: "PDF non généré",
      pdfmonkey: data
    });

  } catch (err) {

    console.error("ERREUR SERVEUR PDF ↓", err);

    return res.status(500).json({
      error: "Erreur serveur",
      message: err.message
    });
  }
}