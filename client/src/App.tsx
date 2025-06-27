import { useState } from 'react';
import Hero from './components/Hero';
import { FluidGlass } from './components/FluidGlass';
import { motion } from 'framer-motion';

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
    <div className="flex flex-col min-h-screen w-full bg-purpleBase text-white font-heading overflow-hidden">
      {/* Hero Section - Fixed height */}
      <div className="h-screen flex items-center justify-center">
        <Hero />
      </div>

      {/* Content Section - Takes remaining space with proper scrolling */}
      <div className="flex-1 w-full flex flex-col items-center justify-start py-12 relative overflow-y-auto">
        {/* Background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[10%] top-[20%] w-[40vw] h-[40vw] bg-orangeCamlin rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute right-[10%] bottom-[20%] w-[30vw] h-[30vw] bg-orangeCamlin rounded-full blur-[100px] opacity-20"></div>
        </div>

        {/* Main content container */}
        <div className="w-full max-w-2xl px-4 space-y-12">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-center p-4 bg-white/10 rounded-lg"
            >
              Error: {error}
            </motion.div>
          )}

          {/* Color Picker Section */}
          <FluidGlass className="w-full p-8 text-white shadow-2xl rounded-[2rem] backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-center">Split Your Color</h2>
              <p className="text-gray-300 text-center">
                Select a hex color and discover its RGB breakdown
              </p>

              <div className="flex flex-col items-center gap-4">
                <label className="flex flex-col items-center gap-2">
                  Pick a color:
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={hex}
                      onChange={handleColorChange}
                      className="w-14 h-14 rounded-full border-4 border-white cursor-pointer"
                    />
                    <span className="font-mono bg-white/10 px-3 py-1 rounded-lg">
                      {hex}
                    </span>
                  </div>
                </label>

                <button
                  onClick={handleFetch}
                  disabled={loading}
                  className="px-6 py-2 bg-goldHighlight hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                      </svg>
                      Splitting...
                    </span>
                  ) : (
                    'Split Color'
                  )}
                </button>
              </div>
            </motion.div>
          </FluidGlass>

          {/* Results Section - Separate block */}
          {rgbData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* RGB Values Section */}
              <FluidGlass className="p-6 rounded-2xl backdrop-blur-lg">
                <h3 className="text-xl font-semibold mb-4">RGB Components</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'Red', value: rgbData.r, color: 'bg-red-500' },
                    { name: 'Green', value: rgbData.g, color: 'bg-green-500' },
                    { name: 'Blue', value: rgbData.b, color: 'bg-blue-500' },
                  ].map((channel) => (
                    <div key={channel.name} className="flex flex-col items-center">
                      <div className={`w-full h-12 rounded-lg mb-2 ${channel.color}`} />
                      <span className="font-mono">{channel.name}: {channel.value}</span>
                    </div>
                  ))}
                </div>
              </FluidGlass>

              {/* Split Composition Section - Separate block */}
              {split && (
                <FluidGlass className="p-6 rounded-2xl backdrop-blur-lg">
                  <h3 className="text-xl font-semibold mb-4">Color Composition</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Red', value: split.r, color: 'bg-red-500' },
                      { name: 'Green', value: split.g, color: 'bg-green-500' },
                      { name: 'Blue', value: split.b, color: 'bg-blue-500' },
                    ].map((channel) => (
                      <div key={channel.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span>{channel.name}</span>
                          <span className="font-mono">{channel.value}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${channel.color}`}
                            style={{ width: `${channel.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </FluidGlass>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;