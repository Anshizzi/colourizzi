import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.query);
  next();
});

// Route: /api/split-rgb?hex=#FFCC00
app.get('/api/split-rgb', (req, res) => {
  try {
    const hex = req.query.hex as string;
    console.log('Received hex:', hex);

    if (!hex) {
      return res.status(400).json({ error: 'Hex parameter is required' });
    }

    // Clean and validate hex
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    console.log('Cleaned hex:', cleanHex);

    if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      console.log('Invalid hex format:', cleanHex);
      return res.status(400).json({ 
        error: 'Invalid hex code. Expected format: #RRGGBB or RRGGBB',
        received: hex 
      });
    }

    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    const total = r + g + b || 1;

    const rgbSplit = {
      r: Math.round((r / total) * 100),
      g: Math.round((g / total) * 100),
      b: Math.round((b / total) * 100),
    };

    const response = { 
      rgb: { r, g, b }, 
      split: rgbSplit,
      originalHex: hex,
      cleanedHex: cleanHex
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
