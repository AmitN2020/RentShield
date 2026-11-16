import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import UploadDropzone from './components/UploadDropzone';
import RiskGaugeWidget from './components/RiskGaugeWidget';
import BengaluruAlertsBanner from './components/BengaluruAlertsBanner';
import MissingClausesSection from './components/MissingClausesSection';
import ClauseList from './components/ClauseList';
import SideBySideTextViewer from './components/SideBySideTextViewer';
import WhatsAppNegotiatorModal from './components/WhatsAppNegotiatorModal';
import {
  FileText,
  MessageSquare,
  Columns,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [result, setResult] = useState(null);
  const [documentText, setDocumentText] = useState('');
  const [filename, setFilename] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [showSplitView, setShowSplitView] = useState(false);

  // WhatsApp Negotiator Modal
  const [isNegotiatorOpen, setIsNegotiatorOpen] = useState(false);
  const [negotiatorClause, setNegotiatorClause] = useState(null);
  const [activeEngine, setActiveEngine] = useState('groq');

  const handleAnalyzePdf = async (file) => {
    setIsAnalyzing(true);
    setError(null);
    setFilename(file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/api/v1/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned status ${response.status}`);
      }

      const data = await response.json();
      setDocumentText(data.raw_text || '');
      setResult(data.analysis);
      setActiveEngine(data.active_provider || 'groq');

      if (data.analysis.risk_category === 'LOW') {
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Failed to process and analyze the rental agreement.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeText = async (text, customTitle = 'Custom Agreement Draft') => {
    setIsAnalyzing(true);
    setError(null);
    setFilename(customTitle);

    try {
      const response = await fetch(`${API_BASE}/api/v1/analyze-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          filename: customTitle
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned status ${response.status}`);
      }

      const data = await response.json();
      setDocumentText(data.raw_text || text);
      setResult(data.analysis);
      setActiveEngine(data.active_provider || 'groq');

      if (data.analysis.risk_category === 'LOW') {
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Failed to analyze text.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenNegotiator = (clause = null) => {
    setNegotiatorClause(clause);
    setIsNegotiatorOpen(true);
  };

  const handleReset = () => {
    setResult(null);
    setDocumentText('');
    setFilename('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-100 font-sans selection:bg-white selection:text-black">
      <Navbar onReset={handleReset} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-rose-500/30 bg-zinc-950 text-xs text-rose-300 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <span className="font-semibold block text-rose-200">Analysis Error:</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {!result ? (
          <UploadDropzone
            onFileSelected={handleAnalyzePdf}
            onAnalyzeText={handleAnalyzeText}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Results Navigation Bar - Minimalist Monochrome */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900">
              <div className="flex items-center space-x-2 truncate">
                <FileText className="w-4 h-4 text-zinc-300 shrink-0" />
                <span className="text-sm font-bold text-white truncate">{filename}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                  {result.total_clauses_analyzed} Clauses Evaluated
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 capitalize">
                  Used: {activeEngine}
                </span>
              </div>

              <div className="flex items-center space-x-2 flex-wrap">
                <button
                  id="btn-toggle-split-view"
                  onClick={() => setShowSplitView(!showSplitView)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center space-x-1.5 ${showSplitView
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                    }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>{showSplitView ? 'Hide Raw Document' : 'View Raw Document'}</span>
                </button>

                <button
                  id="btn-open-negotiator"
                  onClick={() => handleOpenNegotiator(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5 active:scale-[0.98]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Draft WhatsApp Negotiation</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                  title="Upload Another Document"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Split Screen Layout (Optional Raw Text Viewer) */}
            <div className={`grid gap-6 ${showSplitView ? 'lg:grid-cols-12' : 'grid-cols-1'}`}>
              {showSplitView && (
                <div className="lg:col-span-5 h-[800px] sticky top-20">
                  <SideBySideTextViewer
                    documentText={documentText}
                    filename={filename}
                    onClose={() => setShowSplitView(false)}
                  />
                </div>
              )}

              {/* Main Analysis Report Section */}
              <div className={`space-y-6 ${showSplitView ? 'lg:col-span-7' : 'w-full'}`}>
                {/* Risk Gauge Header */}
                <RiskGaugeWidget result={result} />

                {/* Bengaluru Norms Violation Banner */}
                <BengaluruAlertsBanner violations={result.bengaluru_norm_violations} />

                {/* Missing Mandatory Clauses Checklist */}
                <MissingClausesSection missingClauses={result.missing_mandatory_clauses} />

                {/* Categorized Clause Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Categorized Clause Analysis</span>
                      <span className="text-xs text-zinc-500 font-mono font-normal">
                        (17 Functional Legal Categories)
                      </span>
                    </h3>
                  </div>

                  <ClauseList
                    clauses={result.clauses}
                    onNegotiate={handleOpenNegotiator}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* WhatsApp Negotiator Modal */}
      <WhatsAppNegotiatorModal
        isOpen={isNegotiatorOpen}
        onClose={() => setIsNegotiatorOpen(false)}
        clauses={result?.clauses || []}
        initialClause={negotiatorClause}
      />

      {/* Minimalist Monochrome Footer */}
      <footer className="border-t border-zinc-900 bg-black py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p>RentShield. Designed for tenant protection under Karnataka tenancy guidelines.</p>
        </div>
      </footer>
    </div>
  );
}
