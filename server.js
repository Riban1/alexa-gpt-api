import express from "express";

const app = express();
app.use(express.json());

app.post("/", (req, res) => {
  console.log("Alexa request recebida");

  res.json({
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: "Olá! A conexão com o servidor externo está funcionando."
      },
      shouldEndSession: false
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
