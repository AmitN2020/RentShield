import React, { useState } from 'react';
import { FileText, Search, X, Copy, Check } from 'lucide-react';

export default function SideBySideTextViewer({ documentText, filename, onClose }) {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(documentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = documentText ? documentText.split('\n') : [];

  return (
    <div className="h-full rounded-2xl bg-zinc-950 border border-zinc-800/80 flex flex-col overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-3.5 border-b border-zinc-900 bg-zinc-900/40 flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="text-xs font-bold text-white truncate">
            {filename || 'Document Raw Text'}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
            {lines.length} lines
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs transition-colors"
            title="Copy all text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs transition-colors"
              title="Close split view"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Line in Document */}
      <div className="p-2 border-b border-zinc-900 bg-black">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search within raw document..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
          />
        </div>
      </div>

      {/* Raw Text Body with Line Numbers */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-zinc-300 leading-relaxed space-y-1 bg-black/90 select-text">
        {lines.map((line, idx) => {
          const isMatch = search.trim() && line.toLowerCase().includes(search.toLowerCase());
          return (
            <div
              key={idx}
              className={`flex items-start space-x-3 rounded px-1.5 py-0.5 transition-colors ${
                isMatch ? 'bg-zinc-800 text-white font-semibold' : 'hover:bg-zinc-900/50'
              }`}
            >
              <span className="text-[10px] text-zinc-600 select-none w-8 text-right shrink-0">
                {idx + 1}
              </span>
              <span className="flex-1 break-words whitespace-pre-wrap">
                {line || '\u00A0'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
