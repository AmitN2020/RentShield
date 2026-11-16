import React, { useState, useMemo } from 'react';
import { X, Copy, Check, MessageSquare, Send, CheckSquare, Square, CheckCircle2 } from 'lucide-react';

export default function WhatsAppNegotiatorModal({ isOpen, onClose, clauses = [], initialClause = null }) {
  if (!isOpen) return null;

  // Filter clauses that are high or critical risk (score >= 7) or have a counter clause
  const flaggableClauses = useMemo(() => {
    return clauses.filter(c => (
      c.raw_risk_score >= 7 ||
      c.risk_level === 'HIGH' ||
      c.risk_level === 'CRITICAL' ||
      Boolean(c.suggested_rewrite)
    ));
  }, [clauses]);

  // Track selected clauses for the negotiation message
  const [selectedIndices, setSelectedIndices] = useState(() => {
    if (initialClause) {
      const idx = flaggableClauses.findIndex(c => c.category === initialClause.category);
      return idx !== -1 ? [idx] : [0];
    }
    // Select top 3 high-risk clauses by default
    return flaggableClauses.slice(0, 3).map((_, i) => i);
  });

  const [copied, setCopied] = useState(false);
  const [landlordName, setLandlordName] = useState('Sir/Ma\'am');

  const toggleSelect = (idx) => {
    setSelectedIndices(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  // Generate polite, professional WhatsApp negotiation text
  const messageText = useMemo(() => {
    if (flaggableClauses.length === 0) return '';
    const selected = selectedIndices.map(i => flaggableClauses[i]).filter(Boolean);

    let msg = `Hello ${landlordName},\n\n`;
    msg += `Thank you for sharing the draft rental agreement. I am genuinely excited about the property and look forward to a smooth, long-term tenancy.\n\n`;
    msg += `I reviewed the draft clauses and had a few humble requests to align the terms with standard Bengaluru rental practices and Karnataka tenancy norms:\n\n`;

    selected.forEach((clause, index) => {
      msg += `*${index + 1}. Regarding ${clause.category}:*\n`;
      if (clause.category === 'Rent and Security Deposit') {
        msg += `• _Request:_ Could we please cap the security deposit to 2–3 months' rent in line with standard Bengaluru benchmarks? Also, kindly confirm that painting deductions will be based on actual quotes rather than an automatic one-month forfeiture.\n`;
      } else if (clause.category === 'Lock-in Period') {
        msg += `• _Request:_ Could we add a standard exception to the lock-in period in case of unforeseen company job relocation outside Bengaluru or medical emergencies with 30 days notice?\n`;
      } else if (clause.category === 'Termination and Notice Period') {
        msg += `• _Request:_ Could we make the notice period mutual (30 days for both parties) to ensure fairness for both of us?\n`;
      } else if (clause.category === 'Maintenance and Repairs') {
        msg += `• _Request:_ I am happy to take care of minor day-to-day repairs up to ₹1,000. Could the agreement explicitly clarify that major structural/seepage/pipeline repairs remain under the owner's scope?\n`;
      } else {
        msg += `• _Current clause:_ "${clause.original_text.slice(0, 80)}..."\n`;
        if (clause.suggested_rewrite) {
          msg += `• _Proposed amendment:_ "${clause.suggested_rewrite}"\n`;
        }
      }
      msg += `\n`;
    });

    msg += `I would really appreciate your kind consideration on these points so we can finalize and execute the agreement smoothly.\n\n`;
    msg += `Looking forward to your thoughts!\n\nBest regards,\n[Your Name]`;
    return msg;
  }, [selectedIndices, flaggableClauses, landlordName]);

  const handleCopy = () => {
    if (!messageText) return;
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    if (!messageText) return;
    const url = `https://wa.me/?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Draft WhatsApp Negotiation</span>
              </h3>
              <p className="text-xs text-zinc-400">
                {flaggableClauses.length > 0
                  ? 'Auto-draft respectful amendments ready to send to your landlord.'
                  : 'No high or critical risk clauses detected in this agreement.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Only displays negotiation content if there are clauses that require negotiation */}
        {flaggableClauses.length === 0 ? (
          <div className="p-8 sm:p-14 text-center space-y-4 my-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h4 className="text-base font-bold text-white">
                No Clauses Require Negotiation
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All clauses in this agreement are low or moderate risk and adhere to fair Karnataka tenancy norms. There are no high or critical risk terms requiring negotiation.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Landlord Name input */}
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-zinc-400 font-medium">Recipient Title:</span>
                <input
                  type="text"
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  placeholder="e.g. Sir / Mr. Murthy / Landlord Name"
                  className="px-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Clause Selection Checklist */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                  Select clauses to include in negotiation:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {flaggableClauses.map((clause, idx) => {
                    const isChecked = selectedIndices.includes(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleSelect(idx)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-start space-x-2.5 transition-all ${
                          isChecked
                            ? 'bg-zinc-900 border-zinc-600 text-white'
                            : 'bg-black/60 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0 text-white">
                          {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-zinc-600" />}
                        </div>
                        <div className="flex-1 truncate">
                          <span className="font-semibold block truncate text-zinc-200">{clause.category}</span>
                          <span className="text-[10px] font-mono text-zinc-500">Risk Score: {clause.raw_risk_score}/10</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp Preview Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Message Preview
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Formatted for WhatsApp (*bold* & clean layout)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800 font-sans text-xs text-zinc-200 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto select-all">
                  {messageText}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-zinc-900 bg-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 transition-colors flex items-center justify-center space-x-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-400" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center space-x-1.5 active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  <span>Open in WhatsApp</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
