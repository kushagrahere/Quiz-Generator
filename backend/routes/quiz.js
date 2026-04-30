import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate', upload.single('file'), async (req, res) => {
  try {
    let text = req.body.text || '';

    // Parse PDF if uploaded
    if (req.file) {
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Only PDF files are supported' });
      }
      try {
        const data = await pdfParse(req.file.buffer);
        text = data.text;
      } catch (err) {
        console.error('PDF Parse Error:', err);
        return res.status(500).json({ error: 'Failed to parse the PDF file' });
      }
    }

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'No text or PDF provided' });
    }

    const truncatedText = text.substring(0, 50000);

    const prompt = `You are a quiz generator. Given the following text, generate 10 multiple-choice questions.

IMPORTANT: Return ONLY a raw JSON array. No intro text, no explanation, no markdown, no backticks. Start your response with [ and end with ].

Format:
[{ "question": "...", "options": ["A", "B", "C", "D"], "correct": "A", "explanation": "..." }]

Text to generate quiz from:
${truncatedText}`;

    let attempts = 0;
    let responseText = '';

    while (attempts < 2) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        responseText = data.choices[0].message.content;
        break;
      } catch (err) {
        attempts++;
        if (attempts >= 2) throw err;
        console.warn('Groq API failed, retrying...', err);
      }
    }

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No valid JSON array found in response');
    const jsonStr = jsonMatch[0].trim();
    const questions = JSON.parse(jsonStr);

    res.json({ questions, topic: truncatedText.substring(0, 50).replace(/\n/g, ' ') + '...' });
  } catch (error) {
    console.error('❌ Generate Quiz Error:', error.message);
    res.status(500).json({ error: 'Failed to generate quiz: ' + error.message });
  }
});

export default router;