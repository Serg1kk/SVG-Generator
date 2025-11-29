import React, { useState, useCallback } from 'react';
import { generateSvgFromPrompt } from './services/gemini';
import { GenerationStatus } from './types';
import SvgDisplay from './components/SvgDisplay';

const App: React.FC = () => {
  // Default prompt set to what the user requested
  const [prompt, setPrompt] = useState<string>('A pelican riding a bicycle, cartoon vector style, side view, vibrant colors, clean lines');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setStatus(GenerationStatus.LOADING);
    setError(null);
    setSvgContent('');

    try {
      const generatedSvg = await generateSvgFromPrompt(prompt);
      setSvgContent(generatedSvg);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setError(err.message || "An unexpected error occurred.");
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              VectorGen AI
            </h1>
          </div>
          <a 
            href="https://ai.google.dev/gemini-api" 
            target="_blank" 
            rel="noreferrer" 
            className="text-xs text-slate-400 hover:text-white transition-colors border border-slate-700 rounded-full px-3 py-1"
          >
            Powered by Gemini
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <label htmlFor="prompt" className="block text-sm font-semibold text-slate-300 mb-2">
              Describe your SVG
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none placeholder-slate-600 transition-all text-sm leading-relaxed"
                placeholder="E.g. A minimal logo of a mountain..."
              />
            </div>
            
            <div className="mt-4">
              <button
                onClick={handleGenerate}
                disabled={status === GenerationStatus.LOADING || !prompt.trim()}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                  ${status === GenerationStatus.LOADING 
                    ? 'bg-slate-700 cursor-not-allowed opacity-70' 
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 hover:shadow-indigo-500/25'
                  }`}
              >
                {status === GenerationStatus.LOADING ? (
                  <>Processing...</>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate SVG
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Tips</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex gap-2">
                <span className="text-indigo-400">•</span>
                Be specific about style (e.g., "flat", "line art", "pixel").
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400">•</span>
                Mention colors if needed (e.g., "neon palette").
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400">•</span>
                Simple objects work best for pure SVG code generation.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-8 min-h-[500px]">
          <SvgDisplay 
            status={status}
            svgContent={svgContent}
            error={error}
          />
        </div>

      </main>
    </div>
  );
};

export default App;