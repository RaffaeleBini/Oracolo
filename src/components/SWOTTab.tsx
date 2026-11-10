import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, Skull, Layers } from 'lucide-react';
import { OptionSWOT } from '../types';

interface SWOTTabProps {
  swotData: OptionSWOT[];
}

export const SWOTTab: React.FC<SWOTTabProps> = ({ swotData }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    swotData[0]?.optionId || ''
  );

  const activeSwot = swotData.find((s) => s.optionId === selectedOptionId) || swotData[0];

  if (!activeSwot) {
    return <div className="p-8 text-center text-slate-400">Nessuna analisi SWOT disponibile.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Option Selector Switcher */}
      {swotData.length > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Seleziona l'opzione da esaminare in dettaglio:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {swotData.map((s) => {
              const isSelected = s.optionId === selectedOptionId;
              return (
                <button
                  key={s.optionId}
                  onClick={() => setSelectedOptionId(s.optionId)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {s.optionName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SWOT 2x2 Quadrant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quadrant 1: STRENGTHS (Punti di Forza - Interni Positivi) */}
        <div className="bg-slate-900/90 border border-emerald-900/60 rounded-2xl p-6 shadow-lg shadow-emerald-950/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <ShieldCheck className="w-5 h-5" />
              <span>Punti di Forza (Strengths)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Fattori Interni (+)</span>
          </div>

          <div className="space-y-3">
            {activeSwot.strengths.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-950/80 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-100">{item.point}</div>
                  {item.severityOrImpact && (
                    <span className="text-[11px] text-emerald-400/90 font-mono">
                      impatto {item.severityOrImpact}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 2: WEAKNESSES (Debolezze - Interni Negativi) */}
        <div className="bg-slate-900/90 border border-rose-900/60 rounded-2xl p-6 shadow-lg shadow-rose-950/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-rose-900/50">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Debolezze (Weaknesses)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Fattori Interni (-)</span>
          </div>

          <div className="space-y-3">
            {activeSwot.weaknesses.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-rose-950/80 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-100">{item.point}</div>
                  {item.severityOrImpact && (
                    <span className="text-[11px] text-rose-400/90 font-mono">
                      criticità {item.severityOrImpact}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 3: OPPORTUNITIES (Opportunità - Esterni Positivi) */}
        <div className="bg-slate-900/90 border border-sky-900/60 rounded-2xl p-6 shadow-lg shadow-sky-950/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sky-900/50">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-base">
              <TrendingUp className="w-5 h-5" />
              <span>Opportunità (Opportunities)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Fattori Esterni (+)</span>
          </div>

          <div className="space-y-3">
            {activeSwot.opportunities.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-sky-950/80 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-100">{item.point}</div>
                  {item.severityOrImpact && (
                    <span className="text-[11px] text-sky-400/90 font-mono">
                      potenziale {item.severityOrImpact}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 4: THREATS (Minacce - Esterni Negativi) */}
        <div className="bg-slate-900/90 border border-amber-900/60 rounded-2xl p-6 shadow-lg shadow-amber-950/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/50">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
              <Skull className="w-5 h-5" />
              <span>Minacce & Rischi (Threats)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Fattori Esterni (-)</span>
          </div>

          <div className="space-y-3">
            {activeSwot.threats.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-950/80 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-100">{item.point}</div>
                  {item.severityOrImpact && (
                    <span className="text-[11px] text-amber-400/90 font-mono">
                      rischio {item.severityOrImpact}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
