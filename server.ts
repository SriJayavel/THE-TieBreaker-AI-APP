import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely, preserving developer guidelines
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it via Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Analyze Decision Route
app.post("/api/analyze-decision", async (req, res) => {
  try {
    const { title, description, analysisType, options, category } = req.body;

    if (!title || !analysisType) {
      return res.status(400).json({ error: "Missing required fields: title or analysisType" });
    }

    const ai = getGeminiClient();

    let systemInstruction = "You are 'The Tiebreaker', a rational, brilliant, and highly objective decision scientist hired to break ties, analyze hard trade-offs, and recommend structured paths forward. Do not use generic filler words.";
    let prompt = "";
    let responseSchema: any = {};

    if (analysisType === "pros_cons") {
      prompt = `Perform a comprehensive Pros and Cons analysis.
Decision Title: "${title}"
${description ? `Context/Details: "${description}"` : ""}
${category ? `Category: "${category}"` : ""}

Evaluate the top factors. Provide clear, detailed Pros and Cons. Each must have a calculated weight ('high', 'medium', or 'low') and explanation. Conclude with a clear verdict explaining the recommendation and a score (0 to 100) representing overall viability or readiness.`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          summary: { 
            type: Type.STRING, 
            description: "High-level summary of the trade-offs and decision landscape." 
          },
          pros: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "A beneficial factor or advantage of taking the action." },
                weight: { type: Type.STRING, description: "The level of importance: must be exactly 'high', 'medium', or 'low'." },
                explanation: { type: Type.STRING, description: "A detailed description explaining why this pro matters and its implications." }
              },
              required: ["text", "weight", "explanation"]
            }
          },
          cons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "A risk, cost, or disadvantage of taking the action." },
                weight: { type: Type.STRING, description: "The level of severity: must be exactly 'high', 'medium', or 'low'." },
                explanation: { type: Type.STRING, description: "Detailed description explaining why this con or tradeoff is critical." }
              },
              required: ["text", "weight", "explanation"]
            }
          },
          verdict: { 
            type: Type.STRING, 
            description: "A synthesized, direct, objective recommendation that breaks the tie and helps the user decide immediately." 
          },
          score: { 
            type: Type.INTEGER, 
            description: "A calculated viability rating from 0 (terrible choice) to 100 (excellent, highly recommended route)." 
          }
        },
        required: ["summary", "pros", "cons", "verdict", "score"]
      };

    } else if (analysisType === "comparison") {
      const optionList = options && Array.isArray(options) && options.length > 0 
        ? options 
        : ["Option A", "Option B"];

      prompt = `Perform an objective side-by-side criteria-based Comparison Table analysis.
Decision Title: "${title}"
${description ? `Context/Details: "${description}"` : ""}
Options being compared: ${optionList.map(o => `"${o}"`).join(", ")}
${category ? `Category: "${category}"` : ""}

Develop at least 4 critical, custom criteria tailored explicitly to this decision (e.g. Cost, Speed, Long-term Growth, Effort, Joy, etc.).
For each criterion, score every single option on a scale from 1 (terrible) to 10 (perfect) and provide a solid justification text. Select a clear winner/bestOption and give a brilliant final synthesised verdict.`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          summary: { 
            type: Type.STRING, 
            description: "Comprehensive summary of how these specific options stack up against each other." 
          },
          criteria: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Criterion name. E.g., 'Cost Efficiency', 'Scalability', 'Fulfillment', 'Timeline'" },
                explanation: { type: Type.STRING, description: "Why this specific criterion is pivotal in breaking this tie." },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      optionName: { type: Type.STRING, description: "The name of the option being evaluated." },
                      score: { type: Type.INTEGER, description: "A numerical rating from 1 to 10." },
                      text: { type: Type.STRING, description: "Short justification sentence explaining this score." }
                    },
                    required: ["optionName", "score", "text"]
                  }
                }
              },
              required: ["name", "explanation", "options"]
            }
          },
          bestOption: { 
            type: Type.STRING, 
            description: "The name of the single recommended option that wins this comparison. Must be one of the input options." 
          },
          verdict: { 
            type: Type.STRING, 
            description: "A detailed final recommendation on what to do, incorporating the criteria values and breaking the deadlock." 
          }
        },
        required: ["summary", "criteria", "bestOption", "verdict"]
      };

    } else if (analysisType === "swot") {
      prompt = `Perform a high-level SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis.
Decision Title: "${title}"
${description ? `Context/Details: "${description}"` : ""}
${category ? `Category: "${category}"` : ""}

Provide realistic, descriptive factors for each of the four quadrants: 
- Strengths (internal positives, assets)
- Weaknesses (internal negatives, blockages)
- Opportunities (external upsides, favorable trends)
- Threats (external risks, potential pitfalls)

Make each point highly applicable to the decision title. Include a final strategic synthesis action plan as the verdict.`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          summary: { 
            type: Type.STRING, 
            description: "A summary explaining the situational layout and context of this SWOT analysis." 
          },
          strengths: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "A clear internal strength or capital." },
                explanation: { type: Type.STRING, description: "Explanation of how to exploit or build on this strength." }
              },
              required: ["text", "explanation"]
            }
          },
          weaknesses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "An internal vulnerability, limitation, or disadvantage." },
                explanation: { type: Type.STRING, description: "Explanation of how to mitigate or minimize this weakness." }
              },
              required: ["text", "explanation"]
            }
          },
          opportunities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "An external development, trend, or niche that can be capitalized upon." },
                explanation: { type: Type.STRING, description: "Explanation of how to open doors and seize this opportunity." }
              },
              required: ["text", "explanation"]
            }
          },
          threats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "An external risk, competitor move, or danger that could disrupt success." },
                explanation: { type: Type.STRING, description: "Explanation of how to defend against or bypass this threat." }
              },
              required: ["text", "explanation"]
            }
          },
          verdict: { 
            type: Type.STRING, 
            description: "A comprehensive strategic synthesis integrating the SWOT quadrants, acting as a clear recommendation." 
          }
        },
        required: ["summary", "strengths", "weaknesses", "opportunities", "threats", "verdict"]
      };
    } else {
      return res.status(400).json({ error: "Invalid analysisType. Must be pros_cons, comparison, or swot" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.2, // lower temperature for logical decision making
      }
    });

    const textStr = response.text?.trim() || "{}";
    const data = JSON.parse(textStr);

    res.json({
      decisionId: `dec_${Date.now()}`,
      title,
      description,
      analysisType,
      options: options || [],
      category: category || "General",
      createdAt: new Date().toISOString(),
      analysisResult: data
    });

  } catch (error: any) {
    console.error("Gemini decision analysis failure:", error);
    res.status(500).json({ 
      error: "Tiebreaker failed to consult the oracle. Please try again soon.", 
      details: error.message 
    });
  }
});

// Configure Vite middleware and static files
async function mountClient() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite hot-reload middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static artifacts...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Tiebreaker application listening on http://localhost:${PORT}`);
  });
}

mountClient();
