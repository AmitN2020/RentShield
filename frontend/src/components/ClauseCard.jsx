import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function ClauseCard({ clause, onNegotiate }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const score = clause.raw_risk_score || 5;
  const level = clause.risk_level || 'MODERATE';
  const isHighOrCritical = level === 'HIGH' || level === 'CRITICAL' || score >= 7;

  // Accents kept specifically for Risk Categories
  let badgeStyle = {
    bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    border: 'border-zinc-800/80',
    icon: CheckCircle2,
    label: 'Low Risk'
  };

  if (level === 'MODERATE' || (score >= 4 && score <= 6)) {
    badgeStyle = {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      border: 'border-zinc-800/80',
      icon: AlertTriangle,
      label: 'Moderate Risk'
    };
  } else if (level === 'HIGH' || (score >= 7 && score <= 8)) {
    badgeStyle = {
      bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      border: 'border-orange-500/30',
      icon: AlertTriangle,
      label: 'High Risk'
    };
  } else if (level === 'CRITICAL' || score >= 9) {
    badgeStyle = {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      border: 'border-rose-500/40',
      icon: AlertOctagon,
      label: 'Critical Risk'
    };
  }

  const BadgeIcon = badgeStyle.icon;

  const copyRewrite = () => {
    if (clause.suggested_rewrite) {
      navigator.clipboard.writeText(clause.suggested_rewrite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`rounded-xl border ${badgeStyle.border} bg-zinc-950/90 overflow-hidden transition-all duration-200 hover:border-zinc-700 shadow-sm`}>
      {/* Top Header Bar */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 border-b border-zinc-900 bg-zinc-900/30">
        <div className="flex items-center space-x-2.5 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono">
            {clause.category}
          </span>

          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md border text-xs font-semibold ${badgeStyle.bg}`}>
            <BadgeIcon className="w-3.5 h-3.5" />
            <span>{badgeStyle.label}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Risk score gauge badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-black border border-zinc-800 font-mono">
            <span className="text-xs text-zinc-500">Score:</span>
            <span className="text-xs font-extrabold text-white">{score}</span>
            <span className="text-[10px] text-zinc-500">/10</span>
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Verbatim Excerpt */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
              Original Document Text
            </div>
            <div className="p-3 rounded-lg bg-black border border-zinc-850 text-xs text-zinc-300 font-mono italic leading-relaxed border-l-2 border-l-zinc-600">
              "{clause.original_text}"
            </div>
          </div>

          {/* Plain English Translation - Clean Neutral */}
          <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Plain English (What this means for you)
            </span>
            <p className="text-xs text-zinc-200 leading-relaxed">
              {clause.simplified_explanation}
            </p>
          </div>

          {/* Why this is risky in Bengaluru - Amber accent */}
          {clause.risk_reasoning && (
            <div className="p-3 rounded-lg bg-zinc-900/20 border border-zinc-800/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 block mb-1">
                Bengaluru Legal & Market Risk Rationale
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {clause.risk_reasoning}
              </p>
            </div>
          )}

          {/* Tenant-Friendly Suggested Replacement - Emerald accent */}
          {isHighOrCritical && clause.suggested_rewrite && (
            <div className="p-3 rounded-lg bg-emerald-950/15 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Recommended Counter-Clause
                </span>
                <button
                  onClick={copyRewrite}
                  className="inline-flex items-center space-x-1 text-[11px] font-medium text-emerald-300 hover:text-emerald-200 bg-zinc-900 hover:bg-zinc-800 px-2 py-0.5 rounded border border-emerald-500/30 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Counter-Clause</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs font-mono text-emerald-200/95 leading-relaxed">
                {clause.suggested_rewrite}
              </p>
            </div>
          )}

          {/* Action Row - Minimalist High Contrast Button */}
          {isHighOrCritical && (
            <div className="pt-2 border-t border-zinc-900 flex items-center justify-end">
              <button
                onClick={() => onNegotiate(clause)}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-sm hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5 text-black" />
                <span>Draft WhatsApp Negotiation</span>
                <ArrowRight className="w-3 h-3 text-black" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
