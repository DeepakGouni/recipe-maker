require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5001;
const OLLAMA_URL = "http://127.0.0.1:11434";

// Configure CORS to allow requests from frontend
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.post("/api/suggest-recipe", async (req, res) => {
  try {
    const { dietaryNeeds, preferences, ingredients } = req.body;

    const prompt = `Create a detailed recipe that:
    - Meets these dietary needs: ${dietaryNeeds}
    - Matches these preferences: ${preferences}
    - Uses these available ingredients: ${ingredients}
    Include preparation steps, cooking time, and serving suggestions.`;

    const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
      model: "llama3.2:latest",
      messages: [
        {
          role: "system",
          content:
            "You are a professional chef creating customized recipes. Always format your response with:\n1. Recipe name as first line\n2. Blank line\n3. Cooking time and servings\n4. Ingredients list\n5. Preparation steps\n6. Serving suggestions",
        },
        { role: "user", content: prompt },
      ],
      stream: false,
    });

    res.json({ recipe: response.data.message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
