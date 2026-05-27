import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {

  try {

    const { messages } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",

      {
        model: "llama-3.3-70b-versatile",

        messages,

        temperature: 0.7,

        max_tokens: 2048,
      },

      {
        headers: {
          Authorization:
            `Bearer ${process.env.GROQ_API_KEY}`,

          "Content-Type":
            "application/json",
        },
      }
    );

    res.json({
      response:
        response.data.choices[0].message.content,
    });

  } catch (error) {

    console.error(
      "SERVER ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});