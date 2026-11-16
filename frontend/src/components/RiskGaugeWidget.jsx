import React from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon, FileCheck, ShieldAlert } from 'lucide-react';

export default function RiskGaugeWidget({ result }) {
  if (!result) return null;

  const score = result.weighted_overall_score || 5.0;
  const level = result.risk_category || 'MODERATE';
  const totalClauses = result.total_clauses_analyzed || (result.clauses ? result.clauses.length : 0);
  const redFlags = result.high_critical_risk_count || 0;
  const missingCount = result.missing_mandatory_clauses ? result.missing_mandatory_clauses.length : 0;

  // Calculate meter percentage (scale 1 to 10 -> 0% to 100%)
  const percentage = Math.min(100, Math.max(0, ((score - 1) / 9) * 100));

  // Determine styles & advice based on CLAUSE_RISK_FRAMEWORK.md thresholds (keep accent colors)
  let levelConfig = {
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    strokeColor: '#10b981',
    glowClass: 'glow-risk-low',
    title: 'Low Risk • Tenant Friendly',
    recommendation: 'Safe and well-balanced agreement adhering to standard Karnataka practices. Ready to sign.',
    icon: CheckCircle2
  };

  if (level === 'MODERATE' || (score > 3.0 && score <= 6.0)) {
    levelConfig = {
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      strokeColor: '#f59e0b',
      glowClass: 'glow-primary',
      title: 'Moderate Risk • Standard Market Template',
      recommendation: 'Contains customary market friction (standard minor repair liabilities or 6-month lock-in). Minor clarification suggested.',
      icon: AlertTriangle
    };
  } else if (level === 'HIGH' || (score > 6.0 && score <= 8.0)) {
    levelConfig = {
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      strokeColor: '#f97316',
      glowClass: 'glow-risk-high',
      title: 'High Risk • Unfair Market Clauses',
      recommendation: 'Significant financial risk detected (e.g. deposit > 2 months, automatic painting forfeiture, or asymmetric notice). Negotiation strongly advised before signing.',
      icon: AlertTriangle
    };
  } else if (level === 'CRITICAL' || score > 8.0) {
    levelConfig = {
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      strokeColor: '#ef4444',
      glowClass: 'glow-risk-critical',
      title: 'Critical Risk • Predatory or Unlawful Terms',
      recommendation: 'Contains aggressive, unlawful, or trap provisions (e.g. non-refundable deposit, utility cut-off clauses, full lease remaining rent forfeiture). DO NOT SIGN without significant revisions.',
      icon: AlertOctagon
    };
  }

  const LevelIcon = levelConfig.icon;

  // SVG circular gauge math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 1;
  const strokeDashoffset = arcLength - (arcLength * percentage) / 100;

  return (
    <div className={`p-6 rounded-2xl bg-zinc-950/90 border ${levelConfig.borderColor} ${levelConfig.glowClass} relative overflow-hidden transition-all duration-300`}>
      {/* Subtle background accent glow */}
      <div
        className="absolute -right-20 -top-20 w-60 h-60 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: levelConfig.strokeColor }}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Radial Score Gauge */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Minimalist background track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#27272a"
                strokeWidth="11"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeLinecap="round"
                fill="transparent"
              />
              {/* Active animated stroke with accent color */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={levelConfig.strokeColor}
                strokeWidth="11"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Score Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-extrabold tracking-tight font-mono ${levelConfig.color}`}>
                {score.toFixed(1)}
              </span>
              <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                out of 10
              </span>
            </div>
          </div>

          {/* Level description */}
          <div className="text-center sm:text-left max-w-md">
            <div
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md mb-2 border text-xs font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${levelConfig.strokeColor}15`,
                borderColor: `${levelConfig.strokeColor}30`,
                color: levelConfig.strokeColor
              }}
            >
              <LevelIcon className="w-3.5 h-3.5" />
              <span>{levelConfig.title}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1.5">
              Overall Risk Assessment
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {levelConfig.recommendation}
            </p>
          </div>
        </div>

        {/* Right: Quick metric counters - Minimalist Monochrome cards with color accents */}
        <div className="grid grid-cols-3 gap-2.5 w-full lg:w-auto">
          <div className="p-3.5 rounded-xl bg-black border border-zinc-800 text-center min-w-[110px]">
            <span className="text-xs text-zinc-400 block mb-1">Total Clauses</span>
            <span className="text-xl font-bold text-white flex items-center justify-center gap-1 font-mono">
              <FileCheck className="w-4 h-4 text-zinc-400" />
              {totalClauses}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-zinc-800 text-center min-w-[110px]">
            <span className="text-xs text-zinc-400 block mb-1">Red Flags</span>
            <span className={`text-xl font-bold flex items-center justify-center gap-1 font-mono ${redFlags > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              <ShieldAlert className="w-4 h-4" />
              {redFlags}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-zinc-800 text-center min-w-[110px]">
            <span className="text-xs text-zinc-400 block mb-1">Missing Req.</span>
            <span className={`text-xl font-bold flex items-center justify-center gap-1 font-mono ${missingCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              <AlertTriangle className="w-4 h-4" />
              {missingCount}
            </span>
          </div>
        </div>
      </div>

      {result.summary && (
        <div className="mt-5 pt-4 border-t border-zinc-800/80">
          <p className="text-[11px] text-zinc-500 uppercase font-mono tracking-wider mb-1">
            Executive Summary
          </p>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {result.summary}
          </p>
        </div>
      )}
    </div>
  );
}
