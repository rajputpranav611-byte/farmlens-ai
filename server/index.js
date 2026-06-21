import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.use(cors());
app.use(express.json({ limit: '12mb' }));

// Initialize Gemini API (Make sure to set GEMINI_API_KEY in your .env file)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseImageDataUrl = (image) => {
  if (!image || typeof image !== 'string') return null;

  const match = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  return {
    mimeType: match[1],
    data: match[2]
  };
};

const parseJsonResponse = (text) => {
  const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const jsonStart = cleanedText.indexOf('{');
  const jsonEnd = cleanedText.lastIndexOf('}');

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('Gemini did not return JSON.');
  }

  return JSON.parse(cleanedText.slice(jsonStart, jsonEnd + 1));
};

app.post('/api/diagnose', async (req, res) => {
  try {
    const { disease, confidence, language = 'English', image } = req.body;
    const imageData = parseImageDataUrl(image);

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    if (!imageData && !disease) {
      return res.status(400).json({ error: 'Provide either an image or a disease name.' });
    }

    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = imageData
      ? `
      You are FarmLens AI, an agricultural diagnosis assistant for Indian farmers.
      Analyze the crop image and identify the most likely crop disease or visible crop health issue.
      If the image is unclear, say that confidence is low instead of guessing strongly.
      Please provide the response translated to: ${language}.
      
      Return STRICTLY valid JSON with these keys:
      {
        "disease": "Most likely crop disease or issue",
        "confidence": 0.0,
        "severity": "Low, Medium, or High",
        "cause": "Explanation of what causes this disease",
        "organicRemedy": "Actionable organic treatment plan",
        "chemicalRemedy": "Recommended chemical treatments if applicable"
      }
      
      Confidence must be a number from 0 to 1.
      Output only JSON.`
      : `
      You are FarmLens AI, an agricultural diagnosis assistant for Indian farmers.
      Provide treatment details for the crop disease: "${disease}".
      The diagnosis confidence is ${confidence}.
      Please provide the response translated to: ${language}.
      
      Return STRICTLY valid JSON with these keys:
      {
        "disease": "${disease}",
        "confidence": ${Number(confidence) || 0},
        "severity": "Low, Medium, or High",
        "cause": "Explanation of what causes this disease",
        "organicRemedy": "Actionable organic treatment plan",
        "chemicalRemedy": "Recommended chemical treatments if applicable"
      }
      
      Output only JSON.`;

    const parts = imageData
      ? [prompt, { inlineData: imageData }]
      : [prompt];

    const result = await model.generateContent(parts);
    const parsedData = parseJsonResponse(result.response.text());

    res.json({
      disease: parsedData.disease || disease || 'Unknown crop issue',
      confidence: Number(parsedData.confidence ?? confidence ?? 0),
      severity: parsedData.severity || 'Unknown',
      cause: parsedData.cause || 'No cause available.',
      organicRemedy: parsedData.organicRemedy || 'No organic remedy available.',
      chemicalRemedy: parsedData.chemicalRemedy || 'No chemical remedy available.'
    });
  } catch (error) {
    console.error('Error generating diagnosis:', error);
    res.status(500).json({ 
      error: 'Failed to generate diagnosis.',
      model: modelName,
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`FarmLens Backend running on http://localhost:${port}`);
});
