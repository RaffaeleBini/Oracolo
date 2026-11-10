import React from 'react';
import { Compass, Sparkles, AlertOctagon, CheckCircle2, ShieldAlert, CalendarClock, ArrowUpRight } from 'lucide-react';
import { DecisionVerdict, OptionAnalysis } from '../types';

interface VerdictTabProps {
  verdict: DecisionVerdict;
  options: OptionAnalysis[];
}

export const VerdictTab: React.FC<VerdictTabProps> = ({ verdict, options }) => {
  const recommendedOpt = options.find((o) => o.id === verdict.recommendedOptionId) || options[0];

  return (
    <div className="space-y-8">
      {/* Executive Verdict Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 p-6 sm:p-8 shadow-2xl shadow-indigo-950/50">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 font-mono">
              <Compass className="w-4 h-4" />
              <span>SINTESI ESECUTIVA DELL'ORACOLO</span>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60">
              <span className="text-xs text-indigo-300">Indice di Confidenza:</span>
              <span className="text-sm font-bold font-mono text-white tabular-nums">
                {verdict.confidenceScore}%
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              {verdict.recommendationTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-4xl">
              {verdict.executiveSummary}
            </p>
          </div>

          {/* Key Drivers */}
          <div className="pt-4 border-t border-indigo-900/40">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono mb-3">
              I Fattori Determinanti della Scelta (Key Drivers)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {verdict.keyDrivers.map((driver, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                    {driver}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Cognitive Blind Spots & Pre-Mortem Scenario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cognitive Biases / Punti Ciechi */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base pb-3 border-b border-slate-800">
            <AlertOctagon className="w-5 h-5" />
            <span>Punti Ciechi & Trappole Cognitive Rilevate</span>
          </div>

          <div className="space-y-3">
            {verdict.blindSpots.map((spot, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-amber-950/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    {spot.bias}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Attenzione</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {spot.warning}
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-xs text-indigo-300 flex items-start gap-1.5">
                  <span className="font-semibold shrink-0">Antidoto:</span>
                  <span>{spot.suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Pre-Mortem Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base pb-3 border-b border-slate-800">
            <ShieldAlert className="w-5 h-5" />
            <span>Simulazione "Pre-Mortem" a 12 Mesi</span>
          </div>

          <p className="text-xs text-slate-400">
            Immagina di essere tra 12 mesi e che la decisione si sia rivelata fallimentare. Cosa è successo?
          </p>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-950/80 space-y-3">
            <div>
              <span className="text-xs font-mono font-semibold text-rose-400 block mb-1">
                Scenario di Fallimento Più Probabile:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {verdict.preMortem.riskScenario}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-mono font-semibold text-emerald-400 block mb-1">
                Azione Preventiva da Adottare Subito:
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {verdict.preMortem.preventativeAction}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Stage Action Roadmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <CalendarClock className="w-5 h-5 text-indigo-400" />
            <span>Piano Operativo di Attuazione</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Dalla teoria all'azione</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {verdict.actionPlan.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-indigo-400 font-bold uppercase">{step.timeframe}</span>
                <span className="text-slate-500">Fase {idx + 1}</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                {step.action}
              </h4>
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                <span className="text-slate-500 block mb-0.5 font-mono">Risultato atteso:</span>
                <span className="text-slate-300">{step.expectedOutcome}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
