import { useState } from 'react';


function App() {
  const [hex, setHex] = useState('#ffcc00');
  const [rgbData, setRgbData] = useState<{ r: number; g: number; b: number } | null>(null);
  const [split, setSplit] = useState<{ r: number; g: number; b: number } | null>(null);

  const handleFetch = async () => {
    const res = await fetch(`http://localhost:5000/api/split-rgb?hex=${hex}`);
    const data = await res.json();
    setRgbData(data.rgb);
    setSplit(data.split);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎨 Colourizzi</h1>
      <input
        type="color"
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        style={{ width: 100, height: 50 }}
      />
      <button onClick={handleFetch} style={{ marginLeft: '1rem' }}>Split Color</button>

      {rgbData && split && (
        <div style={{ marginTop: '2rem' }}>
          <h2>RGB Breakdown</h2>
          <p>Red: {rgbData.r} ({split.r}%)</p>
          <p>Green: {rgbData.g} ({split.g}%)</p>
          <p>Blue: {rgbData.b} ({split.b}%)</p>
        </div>
      )}
    </div>
  );
}

export default App;
