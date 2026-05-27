import axios from "axios";

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

    // SEND TO BACKEND
    const response =
      await axios.post(

        "http://localhost:5000/api/chat",

        {
          messages: [

            {
              role: "system",

              content: `
You are AskMe AI.

Rules:
- Behave like ChatGPT.
- Maintain conversation memory.
- Answer naturally.
- Be smart and modern.
- Support coding and AI questions.
- Use markdown when needed.
`,
            },

            ...formattedMessages,
          ],
        }
      );

    return response.data.response;

  } catch (error) {

    console.error(
      "Frontend API Error:",
      error.response?.data || error.message
    );

    return "Something went wrong.";
  }
}