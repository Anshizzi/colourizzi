import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());

// Route: /api/split-rgb?hex=#FFCC00
app.get('/api/split-rgb', (req, res) => {
  const hex = req.query.hex as string;

  if (!hex || !/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
    return res.status(400).json({ error: 'Invalid hex code' });
  }

  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  const total = r + g + b || 1;

  const rgbSplit = {
    r: Math.round((r / total) * 100),
    g: Math.round((g / total) * 100),
    b: Math.round((b / total) * 100),
  };

  res.json({ rgb: { r, g, b }, split: rgbSplit });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
