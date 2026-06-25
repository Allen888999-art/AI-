import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to get GoogleGenAI client lazily and safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set. Please set it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Hub chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, model, systemInstruction } = req.body;
    
    // Check if key is available
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: `### ⚠️ API Key Required\nTo enable live AI answers, please configure your **GEMINI_API_KEY** in the **Settings > Secrets** panel in Google AI Studio.\n\n*Simulated Answer based on ${model}:*\n\n"I can help you browse, analyze webpages, and write code! Let's connect my API key to explore my full capabilities."`
      });
    }

    const ai = getGeminiClient();
    
    // Build chat contents for Gemini API (format roles as 'user' and 'model')
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
    }
    
    // Append the latest message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    let effectiveInstruction = systemInstruction || "You are Ainovo AI, a premium, modern, conversational browser assistant.";
    
    if (model === "Ainovo-G1") {
      effectiveInstruction += "\n\nCRITICAL: You are in 'Deep Thinking' mode. Provide a structured, analytical, and logical breakdown. If relevant, include bold takeaways, bullet points, and actionable details. Focus on deep analysis and precision.";
    } else if (model === "Claude") {
      effectiveInstruction += "\n\nYou are simulating Claude 3.5 Sonnet. Your tone is elegant, highly intellectual, humble, slightly formal, and helpful. Focus on nuance and clear formatting.";
    } else if (model === "GPT-4") {
      effectiveInstruction += "\n\nYou are simulating GPT-4o. Your tone is highly direct, efficient, creative, energetic, and highly structured with headings.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: effectiveInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to process AI chat" });
  }
});

// Browser page summarization endpoint
app.post("/api/summarize", async (req, res) => {
  try {
    const { title, url, content } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        summary: `### ⚠️ AI Summary Preview\nConfigure **GEMINI_API_KEY** in the Secrets panel to activate automatic AI generation.\n\n**Quick Digest of ${title}:**\n- This page covers premium browsing trends, mobile UI optimizations, and interactive web elements.\n- It showcases a glassmorphic design system and smart workspace tools.\n- Key link: ${url}`
      });
    }

    const ai = getGeminiClient();
    
    const prompt = `Please summarize the following simulated web page in a highly professional, scannable format suited for a premium browser's AI summary panel.
Page Title: ${title}
Page URL: ${url}
Page Content Preview: ${content || "No content preview available."}

Include:
1. A brief 1-sentence TL;DR overview.
2. 3-4 bulleted Key Insights or key concepts.
3. Relevant search terms or follow-up questions for research.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the built-in AI summarizing engine of the Ainovo AI Browser. Provide beautifully formatted markdown summaries.",
        temperature: 0.2,
      },
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Gemini Summarize Error:", error);
    res.status(500).json({ error: error.message || "Failed to summarize webpage" });
  }
});

// Setup development or production hosting
async function init() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running at http://localhost:${PORT}`);
  });
}

init();
