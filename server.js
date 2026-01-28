import express from "express";

const app = express();
app.use(express.json());

app.post("/", (req, res) => {
  console.log("Alexa request recebido");

  res.json({
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: "Olá! A conexão com o servidor funcionou."
      },
      shouldEndSession: true
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor Alexa rodando na porta", PORT);
});
