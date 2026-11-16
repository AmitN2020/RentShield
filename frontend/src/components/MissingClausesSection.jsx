import React, { useState } from 'react';
import { AlertTriangle, Copy, Check, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export default function MissingClausesSection({ missingClauses = [] }) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (!missingClauses || missingClauses.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-emerald-500/30 bg-zinc-950/90 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-300">
              All 11 Mandatory Clauses Present
            </h4>
            <p className="text-xs text-zinc-400">
              The agreement contains all essential legal provisions required under Karnataka tenancy norms.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          11 / 11 Checked
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 overflow-hidden my-5">
      <div 
        className="p-4 bg-zinc-900/40 flex items-center justify-between cursor-pointer hover:bg-zinc-900/60 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-white">
                Missing Mandatory Clauses
              </h4>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {missingClauses.length} Missing
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Essential contract provisions absent from the document. Request insertion of these clauses prior to signing.
            </p>
          </div>
        </div>

        <button className="text-zinc-400 hover:text-white p-1">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3 divide-y divide-zinc-800/80">
          {missingClauses.map((item, idx) => (
            <div key={idx} className="pt-3 first:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <span className="text-sm font-semibold text-amber-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  {item.clause_name}
                </span>
                <button
                  onClick={() => handleCopy(item.recommended_text, idx)}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-200 border border-zinc-700/80 transition-colors w-fit"
                  title="Copy recommended standard clause text"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy Recommended Clause</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-zinc-400 mb-2">
                <strong className="text-zinc-300">Why it matters: </strong>
                {item.importance}
              </p>

              <div className="p-2.5 rounded-lg bg-black border border-zinc-800 font-mono text-[11px] text-zinc-300 leading-relaxed select-all">
                {item.recommended_text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
