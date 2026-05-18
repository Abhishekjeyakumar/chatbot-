import axios from "axios";

const GROQ_API_KEY =
  import.meta.env.VITE_GROQ_API_KEY;

export async function getGroqResponse(
  userMessage,
  chatMessages = []
) {

  try {

    // CONVERSATION MEMORY
    const formattedMessages =
      chatMessages.map((msg) => ({

        role:
          msg.sender === "user"
            ? "user"
            : "assistant",

        content:
          typeof msg.message === "string"
            ? msg.message
            : JSON.stringify(msg.message),
      }));

    // CURRENT USER MESSAGE
    formattedMessages.push({

      role: "user",

      content: userMessage,
    });

    const response =
      await axios.post(

        "https://api.groq.com/openai/v1/chat/completions",

        {
          model:
            "llama-3.3-70b-versatile",

          messages: [

            {
              role: "system",

              content: `
You are AskMe AI.

Rules:
- Behave like ChatGPT.
- Maintain conversation memory.
- Answer naturally and intelligently.
- Be concise for simple chats.
- Be detailed for technical questions.
- Support coding, debugging, AI, math, writing, reasoning.
- Format markdown cleanly.
- Use bullet points when useful.
- Never repeat unnecessarily.
- Be friendly and modern.
- If image not available say politely.
`,
            },

            ...formattedMessages,
          ],

          temperature: 0.7,

          max_tokens: 2048,

          top_p: 1,

          stream: false,
        },

        {
          headers: {

            Authorization:
              `Bearer ${GROQ_API_KEY}`,

            "Content-Type":
              "application/json",
          },
        }
      );

    return response.data
      .choices[0]
      .message.content;

  } catch (error) {

    console.error(
      "Groq API Error:",
      error
    );

    return
      "Something went wrong.";
  }
}