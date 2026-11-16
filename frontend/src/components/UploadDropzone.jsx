import React, { useState, useRef } from 'react';
import { UploadCloud, Sparkles, ArrowRight, Clipboard } from 'lucide-react';

export default function UploadDropzone({
  onFileSelected,
  onAnalyzeText,
  isAnalyzing
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        onFileSelected(file);
      } else {
        alert('Please upload a valid PDF document.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  const handlePasteSubmit = (e) => {
    e.preventDefault();
    if (pastedText.trim().length < 30) {
      alert('Please paste a substantive agreement draft (at least a few sentences).');
      return;
    }
    onAnalyzeText(pastedText);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Audit Rental Agreements <br />
          <span className="text-zinc-400 font-normal">Before You Sign & Pay</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
          Clause-by-clause risk scoring, missing clause detection, and negotiation message drafting.
        </p>
      </div>

      {/* Main Ingestion Box */}
      <div className="rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-3 sm:p-6 shadow-2xl relative">
        {/* Tab Toggle - Minimalist Monochrome */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${activeTab === 'upload'
              ? 'bg-white text-black shadow-sm'
              : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800/60'
              }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload PDF Agreement</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${activeTab === 'paste'
              ? 'bg-white text-black shadow-sm'
              : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800/60'
              }`}
          >
            <Clipboard className="w-4 h-4" />
            <span>Paste Agreement Text</span>
          </button>
        </div>

        {/* Tab 1: Upload PDF Dropzone */}
        {activeTab === 'upload' && (
          <div
            id="pdf-dropzone"
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !isAnalyzing && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 group ${isDragOver
              ? 'border-white bg-white/5 scale-[1.01]'
              : 'border-zinc-800 hover:border-zinc-600 bg-black/40 hover:bg-zinc-900/40'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isAnalyzing}
            />

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="w-10 h-10 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <div className="space-y-1">
                  <p className="text-base font-bold text-white">Analyzing Agreement...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:scale-105 group-hover:text-white transition-all">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">
                    Drop your rental agreement PDF here, or <span className="text-white underline">browse</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Accepts digital and scanned PDF contracts
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Paste Contract Text */}
        {activeTab === 'paste' && (
          <form onSubmit={handlePasteSubmit} className="space-y-3">
            <textarea
              rows={9}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste agreement clauses or draft text here to audit..."
              className="w-full p-4 rounded-xl bg-black border border-zinc-800 text-xs sm:text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono leading-relaxed"
              disabled={isAnalyzing}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isAnalyzing || pastedText.trim().length < 30}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-40 text-black text-xs sm:text-sm font-semibold shadow-sm flex items-center space-x-2 transition-all active:scale-[0.98]"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Agreement Text'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
