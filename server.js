import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

// ===============================
// CONFIG OPENAI
// ===============================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ===============================
// ROTA DE TESTE (IMPORTANTE)
// ===============================
app.get("/", (req, res) => {
  res.send("Servidor Alexa + OpenAI rodando 🚀");
});

// ===============================
// ROTA DA ALEXA
// ===============================
app.post("/", async (req, res) => {
  try {
    const request = req.body;

    // 🔹 Se for abertura da skill
    if (request.request?.type === "LaunchRequest") {
      return res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: "Olá! Pode falar comigo."
          },
          shouldEndSession: false
        }
      });
    }

    // 🔹 Se for uma fala do usuário
    if (request.request?.type === "IntentRequest") {
      const userText =
        request.request.intent?.slots?.text?.value ||
        "Converse comigo";

      // 🔥 CHAMADA AO CHATGPT
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um assistente educado e objetivo."
          },
          {
            role: "user",
            content: userText
          }
        ]
      });

      const resposta =
        completion.choices[0]?.message?.content ||
        "Não consegui responder agora.";

      return res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: resposta
          },
          shouldEndSession: false
        }
      });
    }

    // 🔹 Fallback
    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Não entendi o pedido."
        },
        shouldEndSession: true
      }
    });

  } catch (error) {
    console.error("Erro:", error);
    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Ocorreu um erro no servidor."
        },
        shouldEndSession: true
      }
    });
  }
});

// ===============================
// START SERVER (RAILWAY)
// ===============================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

