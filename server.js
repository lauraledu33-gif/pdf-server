console.log("TEST DEMARRAGE");
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PDFMONKEY_API_KEY = "6EQ11tZ5sLyfxx1BTd-EnNi4ByjADDeu";

app.get("/", (req, res) => {
  res.send("Serveur PDFMonkey actif");
});

app.post("/generate-pdf", async (req, res) => {
  try {
    const { templateId, payload } = req.body;

    const response = await fetch("https://api.pdfmonkey.io/api/v1/documents", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + PDFMONKEY_API_KEY,
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
      res.json({ url: data.document.download_url });
    } else {
      res.status(500).json({ error: "PDF non généré", data });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Serveur prêt sur http://localhost:3000");
});