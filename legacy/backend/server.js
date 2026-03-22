require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up Multer for in-memory uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/extract', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    let validMimeType = req.file.mimetype;
    
    // Normalize edge-case and common mime types because Gemini strictly enforces standard types
    if (validMimeType === 'image/jpg') validMimeType = 'image/jpeg';
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(validMimeType)) {
      // Fallback strategy: if the image isn't strictly recognized but multer let it through,
      // forcibly tell Gemini it's a JPEG, which handles JPG/JPEG buffers seamlessly most times.
      validMimeType = 'image/jpeg'; 
    }

    const { buffer } = req.file;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert OCR and parsing system. Extract the items from this receipt image.
      Identify distinct line items.
      Return ONLY a clean JSON array with objects in this exact structure:
      [
        {
          "id": "item_1",
          "name": "Pizza",
          "price": 12.50,
          "qty": 1
        }
      ]
      Generate a unique string ID for each item. Ensure the price is a raw number (no decimals or currency strings, just the number). 
      Exclude subtotals, tax, discounts, and tips from the items list.
      Important: Ensure there is absolutely NO markdown formatting (no \`\`\`json wrappers) around your response. Your entire response must literally be the JSON array.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: validMimeType
        }
      }
    ]);

    const responseText = result.response.text().trim();
    // Sometimes Gemini wraps response in markdown, let's strip it to be safe.
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '');
    
    let parsedData = [];
    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON form Gemini:", jsonString);
      return res.status(500).json({ error: 'Invalid response from AI model' });
    }

    res.json(parsedData);
  } catch (error) {
    console.error('Error during OCR process:', error);
    res.status(500).json({ error: 'Internal server error processing image' });
  }
});

// Mock Database memory for demonstration
const savedReceiptsDB = [];

app.post('/api/receipts', (req, res) => {
  const { items, participants, overallGrandTotal, user } = req.body;
  if (!user) return res.status(401).json({ error: 'Not logged in' });

  const receiptRecord = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    user,
    overallGrandTotal,
    participants,
    items
  };
  
  savedReceiptsDB.push(receiptRecord);
  console.log(`[DB SAVE] Successfully archived receipt ${receiptRecord.id} for user ${user}`);
  res.json({ success: true, receiptId: receiptRecord.id });
});

app.get('/api/receipts', (req, res) => {
  const user = req.query.user;
  if (!user) return res.status(401).json({ error: 'Not logged in' });
  
  // Return the user's receipts, newest first
  const userHistory = savedReceiptsDB.filter(r => r.user === user).reverse();
  res.json(userHistory);
});

app.listen(port, () => {
  console.log(`PAYERS Backend listening at http://localhost:${port}`);
});
