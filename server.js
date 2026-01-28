import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

// OpenAI client (usa variável de ambiente do Railway)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Endpoint chamado pela Alexa
app.post("/", async (req, res) => {
  try {
    const requestType = req.body.request.type;

    // ===============================
    // 1️⃣ Quando o usuário abre a skill
    // ===============================
    if (requestType === "LaunchRequest") {
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

    // =========================================
    // 2️⃣ Quando o usuário faz uma pergunta (GPT)
    // =========================================
    if (
      requestType === "IntentRequest" &&
      req.body.request.intent.name === "AskGPTIntent"
    ) {
      const userText =
        req.body.request.intent.slots.query?.value ||
        "Olá";

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é uma assistente chamada Alexa GPT. Responda de forma curta, clara e falável, como se estivesse conversando."
          },
          {
            role: "user",
            content: userText
          }
        ],
        max_tokens: 120
      });

      const answer =
        completion.choices[0].message.content;

      return res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: answer
          },
          shouldEndSession: false
        }
      });
    }

    // =========================
    // 3️⃣ Fallback (segurança)
    // =========================
    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Não entendi. Pode repetir?"
        },
        shouldEndSession: false
      }
    });

  } catch (error) {
    console.error("Erro:", error);

    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Ocorreu um erro ao falar com a inteligência artificial."
        },
        shouldEndSession: true
      }
    });
  }
});

// Porta exigida pelo Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
