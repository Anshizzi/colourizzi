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
      setError(err instanceof Error ? err.message : 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHex(cleanHexValue(e.target.value));
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-purpleBase text-white font-heading overflow-hidden">
      <div className="h-screen flex items-center justify-center">
        <Hero />
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center py-6 relative">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[10%] top-[20%] w-[40vw] h-[40vw] bg-orangeCamlin rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute right-[10%] bottom-[20%] w-[30vw] h-[30vw] bg-orangeCamlin rounded-full blur-[100px] opacity-20"></div>
        </div>

        <div className="w-full max-w-6xl px-4">
          <FluidGlass className="w-full p-6 text-white shadow-2xl rounded-3xl backdrop-blur-lg border border-white/10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-goldHighlight to-orange-300 bg-clip-text text-transparent">
                  Color Splitter
                </h2>
                <p className="text-gray-300 text-sm max-w-md mx-auto">
                  Analyze and break down colors into RGB components
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
                <input
                  type="color"
                  value={hex}
                  onChange={handleColorChange}
                  className="w-14 h-14 rounded-xl border-2 border-white/30 cursor-pointer shadow-lg"
                />
                <div className="font-mono text-lg bg-white/10 px-4 py-2 rounded-xl border border-white/20 min-w-[100px] text-center">
                  {hex}
                </div>
                <button
                  onClick={handleFetch}
                  disabled={loading}
                  className="px-6 py-2.5 bg-goldHighlight hover:bg-yellow-400 text-black font-semibold text-sm rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                      </svg>
                      Analyzing
                    </span>
                  ) : (
                    'Analyze'
                  )}
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-300 text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm"
                >
                  <strong>Error:</strong> {error}
                </motion.div>
              )}

              {rgbData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  <div className="w-full h-16 rounded-2xl border-2 border-white/20 shadow-inner" style={{ backgroundColor: hex }}></div>

                  <div className="grid grid-cols-3 md:grid-cols-3 gap-6 px-2 md:px-6">
                    <div className="rounded-[28px] p-6 backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl transition-all duration-300 hover:scale-[1.01]">
                      <h3 className="text-xl font-semibold mb-4 text-center text-goldHighlight">RGB Values</h3>
                      <div className="space-y-3">
                        {[{ name: 'R', value: rgbData.r, color: 'bg-red-500' }, { name: 'G', value: rgbData.g, color: 'bg-green-500' }, { name: 'B', value: rgbData.b, color: 'bg-blue-500' }].map((c) => (
                          <div key={c.name} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded-full ${c.color}`} />
                              <span className="text-gray-200 font-medium">{c.name}</span>
                            </div>
                            <span className="text-white font-mono text-lg font-bold">{c.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {split && (
                      <div className="rounded-[30px] p-6 backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-center text-goldHighlight">Composition</h3>
                        <div className="space-y-3">
                          {[{ name: 'R', value: split.r, color: 'bg-red-500' }, { name: 'G', value: split.g, color: 'bg-green-500' }, { name: 'B', value: split.b, color: 'bg-blue-500' }].map((c) => (
                            <div key={c.name}>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-200 font-medium">{c.name}</span>
                                <span className="text-white font-mono text-sm font-bold">{c.value.toFixed(1)}%</span>
                              </div>
                              <div className="h-3 rounded-full bg-white/20 overflow-hidden">
                                <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.value}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="rounded-[30px] p-6 backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg">
                      <h3 className="text-xl font-semibold mb-4 text-center text-goldHighlight">Quick Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-200">Hex</span>
                          <span className="text-white font-mono text-sm font-bold">{hex}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-200">RGB</span>
                          <span className="text-white font-mono text-sm font-bold">{rgbData.r}, {rgbData.g}, {rgbData.b}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-200">Dominant</span>
                          <span className="text-goldHighlight font-mono text-sm font-bold">{split ? (['R', 'G', 'B'][split.r > split.g && split.r > split.b ? 0 : split.g > split.b ? 1 : 2]) : '—'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-200">Average</span>
                          <span className="text-white font-mono text-sm font-bold">{Math.round((rgbData.r + rgbData.g + rgbData.b) / 3)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-white/5 to-white/10 p-4 rounded-2xl border border-white/10 shadow-lg">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-6 text-base">
                        <span className="text-gray-300">Brightness:</span>
                        <span className="font-bold text-goldHighlight">{Math.round(((rgbData.r * 299 + rgbData.g * 587 + rgbData.b * 114) / 1000))}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-300">Saturation:</span>
                        <span className="font-bold text-goldHighlight">{split ? Math.round((Math.max(split.r, split.g, split.b) - Math.min(split.r, split.g, split.b))) + '%' : '—'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </FluidGlass>
        </div>
      </div>
    </div>
  );
}

export default App;
