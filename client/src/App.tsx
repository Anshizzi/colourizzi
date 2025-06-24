import { useState } from 'react';

function App() {
  const [hex, setHex] = useState('#ffcc00');
  const [rgbData, setRgbData] = useState<{ r: number; g: number; b: number } | null>(null);
  const [split, setSplit] = useState<{ r: number; g: number; b: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanHexValue = (value: string): string => {
    // Remove any non-hex characters and ensure proper format
    let cleaned = value.replace(/[^#0-9A-Fa-f]/g, '');
    if (!cleaned.startsWith('#')) {
      cleaned = '#' + cleaned;
    }
    // Ensure exactly 7 characters (#RRGGBB)
    if (cleaned.length > 7) {
      cleaned = cleaned.substring(0, 7);
    }
    return cleaned;
  };

  const handleFetch = async () => {
    const cleanedHex = cleanHexValue(hex);
    console.log('Original hex:', hex);
    console.log('Cleaned hex:', cleanedHex);
    
    setLoading(true);
    setError(null);
    
    try {
      const url = `http://localhost:5000/api/split-rgb?hex=${encodeURIComponent(cleanedHex)}`;
      console.log('Fetching URL:', url);
      
      const res = await fetch(url);
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Fetched data:', data);
      
      setRgbData(data.rgb);
      setSplit(data.split);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Color input raw value:', value);
    const cleanedValue = cleanHexValue(value);
    console.log('Color input cleaned value:', cleanedValue);
    setHex(cleanedValue);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Colourizzi</h1>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',  
        }}
      >
        <input
          type="color"
          value={hex}
          onChange={handleColorChange}
          style={{ width: 100, height: 50, border: '2px solid #ccc' }}
        />

        <button
          onClick={handleFetch}
          disabled={loading}
          style={{
            background: loading ? '#555' : '#111',
            color: '#fff',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Loading...' : 'Split Color'}
        </button>

        {error && (
          <div style={{ color: '#ff6b6b', fontSize: '14px' }}>
            Error: {error}
          </div>
        )}

        {split && !loading && (
          <div style={{ color: '#fff', lineHeight: 1.5 }}>
            <strong>Split:</strong> {split.r}% R, {split.g}% G, {split.b}% B
          </div>
        )}

        {rgbData && !loading && (
          <div style={{ color: '#fff', lineHeight: 1.5 }}>
            <strong>RGB:</strong> {rgbData.r}, {rgbData.g}, {rgbData.b}
          </div>
        )}
      </div>

      <div style={{ marginTop: '1rem', color: '#888', fontSize: '12px' }}>
        Current hex: {hex}
      </div>
    </div>
  );
}

export default App;
