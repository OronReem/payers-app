// Vercel Serverless Function: /api/extract
// This replaces the Express backend for the Gemini AI receipt scanning.
// Deployed automatically by Vercel when the project is pushed to GitHub.

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Helper: convert a Node.js readable stream to a Buffer in case Vercel doesn't parse body
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  // Allow CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing in the environment");
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server/Vercel.' });
    }

    let fileBuffer, mimeType;
    let dataPayload = null;
    let parsedMime = 'image/jpeg';
    
    // Check if Vercel automatically parsed the JSON body (which is default for Vercel)
    if (typeof req.body === 'object' && req.body !== null && req.body.data) {
      dataPayload = req.body.data;
      parsedMime = req.body.mimeType || 'image/jpeg';
    } else {
      // Manually parse if body parser is off or it's running locally in raw stream mode
      const bodyStr = await streamToBuffer(req);
      if (bodyStr.length === 0) {
        return res.status(400).json({ error: 'Empty request body' });
      }
      try {
        const parsed = JSON.parse(bodyStr.toString());
        dataPayload = parsed.data;
        parsedMime = parsed.mimeType || 'image/jpeg';
      } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    if (!dataPayload) {
      return res.status(400).json({ error: 'No image data provided in JSON' });
    }

    fileBuffer = Buffer.from(dataPayload, 'base64');
    mimeType = parsedMime;

    // Normalize mime type
    if (mimeType === 'image/jpg') mimeType = 'image/jpeg';
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(mimeType)) {
      mimeType = 'image/jpeg';
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are an expert OCR and parsing system. Extract the items from this receipt image.
Identify distinct line items.
Return ONLY a clean JSON array with objects in this exact structure:
[{"id":"item_1","name":"Pizza","price":12.50,"qty":1}]
Generate a unique string ID for each item. Ensure the price is a raw number (no currency symbols, just the number).
Exclude subtotals, tax, discounts, and tips from the items list.
Important: Absolutely NO markdown formatting around your response. Your entire response must be the JSON array only.`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: fileBuffer.toString('base64'), mimeType } }
    ]);

    const responseText = result.response.text().trim();
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsedData = [];
    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse JSON from Gemini:', jsonString);
      return res.status(500).json({ error: 'Invalid response from AI model. Please try again with a clearer photo.' });
    }

    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error during OCR process:', error);
    res.status(500).json({ error: error.message || 'Internal server error processing image' });
  }
};
