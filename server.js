import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/", async (req, res) => {
  try {
    // Texto do usuário
    const userText =
      req.body?.request?.intent?.slots?.query?.value ||
      "Olá";

    // Recupera memória da sessão
    const sessionAttributes =
      req.body?.session?.attributes || {};

    let history = sessionAttributes.history || [];

    // Adiciona a fala do usuário
    history.push({
      role: "user",
      content: userText
    });

    // Limita histórico (evita custo alto)
    history = history.slice(-10);

    // Chamada ao GPT com memória
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é uma assistente chamada Eco Guia. Responda de forma curta, clara e falável."
        },
        ...history
      ],
      max_tokens: 150
    });

    const answer = completion.choices[0].message.content;

    // Salva resposta no histórico
    history.push({
      role: "assistant",
      content: answer
    });

    // Resposta para Alexa COM memória
    res.json({
      version: "1.0",
      sessionAttributes: {
        history
      },
      response: {
        outputSpeech: {
          type: "PlainText",
          text: answer
        },
        shouldEndSession: false
      }
    });
  } catch (err) {
    console.error(err);
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Tive um problema ao lembrar da conversa."
        },
        shouldEndSession: true
      }
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});

