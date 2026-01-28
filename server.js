const express = require("express");
const app = express();

app.use(express.json());

app.post("/", (req, res) => {
  console.log("Alexa request recebida");

  res.json({
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: "Olá, estou funcionando corretamente."
      },
      shouldEndSession: false
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
