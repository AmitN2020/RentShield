import React, { useState, useMemo } from 'react';
import ClauseCard from './ClauseCard';
import { Search, AlertOctagon } from 'lucide-react';

export default function ClauseList({ clauses = [], onNegotiate }) {
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = useMemo(() => {
    const set = new Set();
    clauses.forEach(c => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set).sort();
  }, [clauses]);

  const filteredClauses = useMemo(() => {
    return clauses.filter(c => {
      // Risk filter
      if (selectedRisk === 'CRITICAL' && c.risk_level !== 'CRITICAL' && c.raw_risk_score < 9) return false;
      if (selectedRisk === 'HIGH' && c.risk_level !== 'HIGH' && (c.raw_risk_score < 7 || c.raw_risk_score > 8)) return false;
      if (selectedRisk === 'MODERATE' && c.risk_level !== 'MODERATE' && (c.raw_risk_score < 4 || c.raw_risk_score > 6)) return false;
      if (selectedRisk === 'LOW' && c.risk_level !== 'LOW' && c.raw_risk_score > 3) return false;
      if (selectedRisk === 'FLAGGED' && c.raw_risk_score < 7) return false;

      // Category filter
      if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const inCat = c.category?.toLowerCase().includes(q);
        const inText = c.original_text?.toLowerCase().includes(q);
        const inExpl = c.simplified_explanation?.toLowerCase().includes(q);
        const inReason = c.risk_reasoning?.toLowerCase().includes(q);
        return inCat || inText || inExpl || inReason;
      }

      return true;
    });
  }, [clauses, search, selectedRisk, selectedCategory]);

  return (
    <div className="space-y-4">
      {/* Search and Filter Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clauses, terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>

        {/* Filter Pills with risk accents */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-medium">
          <button
            onClick={() => setSelectedRisk('ALL')}
            className={`shrink-0 px-3 py-1.5 rounded-lg transition-all ${selectedRisk === 'ALL'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
          >
            All ({clauses.length})
          </button>

          <button
            onClick={() => setSelectedRisk('FLAGGED')}
            className={`shrink-0 px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${selectedRisk === 'FLAGGED'
              ? 'bg-rose-500 text-white font-semibold shadow-sm'
              : 'bg-zinc-900 text-rose-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Red Flags ({clauses.filter(c => c.raw_risk_score >= 7).length})</span>
          </button>

          <button
            onClick={() => setSelectedRisk('MODERATE')}
            className={`shrink-0 px-3 py-1.5 rounded-lg transition-all ${selectedRisk === 'MODERATE'
              ? 'bg-amber-500 text-black font-semibold shadow-sm'
              : 'bg-zinc-900 text-amber-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
          >
            Moderate ({clauses.filter(c => c.raw_risk_score >= 4 && c.raw_risk_score <= 6).length})
          </button>

          <button
            onClick={() => setSelectedRisk('LOW')}
            className={`shrink-0 px-3 py-1.5 rounded-lg transition-all ${selectedRisk === 'LOW'
              ? 'bg-emerald-500 text-black font-semibold shadow-sm'
              : 'bg-zinc-900 text-emerald-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
          >
            Safe ({clauses.filter(c => c.raw_risk_score <= 3).length})
          </button>
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-auto px-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 cursor-pointer"
        >
          <option value="ALL">All Categories ({categories.length})</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Clause Cards Stack */}
      <div className="space-y-3">
        {filteredClauses.length > 0 ? (
          filteredClauses.map((clause, idx) => (
            <ClauseCard
              key={idx}
              clause={clause}
              onNegotiate={onNegotiate}
            />
          ))
        ) : (
          <div className="p-8 text-center rounded-xl border border-zinc-800 bg-zinc-950/60 text-zinc-500 text-xs font-mono">
            No clauses match the selected search or filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
