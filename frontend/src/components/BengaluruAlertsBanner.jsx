import React from 'react';
import { AlertCircle, Landmark } from 'lucide-react';

export default function BengaluruAlertsBanner({ violations }) {
  if (!violations || violations.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-500/30 bg-zinc-950/90 p-4 my-4 animate-soft-pulse">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5 border border-amber-500/20 shrink-0">
          <Landmark className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
              Bengaluru Market & Legal Tenancy Alerts ({violations.length})
            </h4>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Karnataka Norms
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 mb-2.5">
            The following terms deviate significantly from fair tenant standards established by Karnataka High Court precedents and tenancy guidelines:
          </p>

          <ul className="space-y-1.5">
            {violations.map((alert, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>{alert}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
