import { useState } from 'react';

function App() {
  const [hex, setHex] = useState('#ffcc00');
  const [rgbData, setRgbData] = useState<{ r: number; g: number; b: number } | null>(null);
  const [split, setSplit] = useState<{ r: number; g: number; b: number } | null>(null);

  const handleFetch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/split-rgb?hex=${hex}`);
      const data = await res.json();
      setRgbData(data.rgb);
      setSplit(data.split);
    } catch (err) {
      console.error('Failed to fetch RGB data:', err);
    }
  };

  return (
  <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
    <h1>🎨 Colourizzi</h1>

    {/* Horizontal container for input, button, and result */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <input
        type="color"
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        style={{ width: 100, height: 50, border: '2px solid #ccc' }}
      />

      <button
        onClick={handleFetch}
        style={{
          background: '#111',
          color: '#fff',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Split Color
      </button>

      {/* Result appears here, inline */}
      {rgbData && split && (
        <div style={{ color: '#fff' }}>
          <strong>RGB:</strong> {rgbData.r}, {rgbData.g}, {rgbData.b} &nbsp;
          <strong>Split:</strong> {split.r}% R, {split.g}% G, {split.b}% B
        </div>
      )}
    </div>
  </div>
)
}
export default App;
