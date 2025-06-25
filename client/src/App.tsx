import { useState } from 'react';

function App() {
  const [hex, setHex] = useState('#ffcc00');
  const [rgbData, setRgbData] = useState<{ r: number; g: number; b: number } | null>(null);
  const [split, setSplit] = useState<{ r: number; g: number; b: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanHexValue = (value: string): string => {
    let cleaned = value.replace(/[^#0-9A-Fa-f]/g, '');
    if (!cleaned.startsWith('#')) cleaned = '#' + cleaned;
    return cleaned.length > 7 ? cleaned.substring(0, 7) : cleaned;
  };

  const handleFetch = async () => {
    const cleanedHex = cleanHexValue(hex);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:5000/api/split-rgb?hex=${encodeURIComponent(cleanedHex)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setRgbData(data.rgb);
      setSplit(data.split);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHex(cleanHexValue(e.target.value));
  };

  return (
    <main className="app-container">
      <h1 className="title">🎨 Colourizzi</h1>

      <section className="controls">
        <label className="color-picker-label">
          Pick a color:
          <input
            type="color"
            value={hex}
            onChange={handleColorChange}
            className="color-picker"
          />
        </label>

        <button
          onClick={handleFetch}
          disabled={loading}
          className={`fetch-button ${loading ? 'loading' : ''}`}
        >
          {loading ? 'Loading...' : 'Split Color'}
        </button>
      </section>

      <section className="output">
        {error && <div className="error">Error: {error}</div>}

        {split && !loading && (
          <div className="result">
            <strong>Split:</strong> {split.r}% R, {split.g}% G, {split.b}% B
          </div>
        )}

        {rgbData && !loading && (
          <div className="result">
            <strong>RGB:</strong> {rgbData.r}, {rgbData.g}, {rgbData.b}
          </div>
        )}

        <div className="current-hex">Current hex: {hex}</div>
      </section>
    </main>
  );
}

export default App;
