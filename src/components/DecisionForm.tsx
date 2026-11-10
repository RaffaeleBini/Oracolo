import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, ArrowRight, Wand2, Compass, HelpCircle } from 'lucide-react';
import { DecisionInput, PresetDecision } from '../types';
import { DECISION_PRESETS } from '../data/presets';

interface DecisionFormProps {
  onSubmit: (input: DecisionInput) => void;
  isLoading: boolean;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [options, setOptions] = useState<string[]>([
    'Opzione A: Intraprendere la nuova strada',
    'Opzione B: Mantenere la direzione attuale',
  ]);
  const [timeHorizon, setTimeHorizon] = useState<DecisionInput['timeHorizon']>('Medio termine (mesi)');
  const [riskTolerance, setRiskTolerance] = useState<DecisionInput['riskTolerance']>('Bilanciata');
  const [criteriaNotes, setCriteriaNotes] = useState('');

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, `Opzione ${String.fromCharCode(65 + options.length)}`]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleLoadPreset = (preset: PresetDecision) => {
    setTitle(preset.title);
    setContext(preset.context);
    setOptions(preset.options);
    setTimeHorizon(preset.timeHorizon);
    setRiskTolerance(preset.riskTolerance);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      context: context.trim(),
      options: options.map((o) => o.trim()).filter(Boolean),
      timeHorizon,
      riskTolerance,
      criteriaNotes: criteriaNotes.trim(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Editorial Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
          <span>Intelligenza Decisionale</span>
          <span aria-hidden="true">·</span>
          <span>Pro & Contro</span>
          <span aria-hidden="true">·</span>
          <span>Matrice Comparativa</span>
          <span aria-hidden="true">·</span>
          <span>SWOT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 text-balance">
          Quale decisione devi prendere oggi?
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-balance">
          Descrivi il tuo dilemma. L'Oracolo esaminerà le alternative attraverso modelli razionali,
          pesi personalizzati e valutazione dei punti ciechi cognitivi.
        </p>
      </div>

      {/* Preset Inspiration Pills / Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Esempi guidati per iniziare subito
          </span>
          <span className="text-xs text-slate-500">Un clic per caricare</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DECISION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-indigo-400 mb-1">
                <span className="font-medium">{preset.category}</span>
                <span className="text-slate-500 text-[11px]">{preset.timeHorizon}</span>
              </div>
              <div className="text-sm font-medium text-slate-200 group-hover:text-white line-clamp-1 transition-colors">
                {preset.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Decision Form Container */}
      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-950/50">
        {/* Core Question Input */}
        <div className="mb-6">
          <label htmlFor="decision-title" className="block text-sm font-semibold text-slate-200 mb-2">
            La decisione o quesito centrale <span className="text-indigo-400">*</span>
          </label>
          <input
            id="decision-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Es: Dovrei accettare la nuova proposta di lavoro o restare nel mio ruolo attuale?"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base"
          />
        </div>

        {/* Context and Motivation */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="decision-context" className="block text-sm font-semibold text-slate-200">
              Contesto, vincoli e motivazioni personali
            </label>
            <span className="text-xs text-slate-500">Opzionale ma altamente consigliato</span>
          </div>
          <textarea
            id="decision-context"
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Quali sono i tuoi vincoli economici, familiari o temporali? Cosa ti preoccupa di più? Qual è il tuo obiettivo prioritario a 1-3 anni?"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm resize-none"
          />
        </div>

        {/* Options to Compare */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Opzioni in gara ({options.length})
              </label>
              <p className="text-xs text-slate-400">
                Inserisci almeno 2 percorsi distinti da confrontare
              </p>
            </div>
            {options.length < 4 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer py-1 px-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Aggiungi Opzione</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {options.map((optionText, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-300 shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <input
                  type="text"
                  required
                  value={optionText}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Descrivi l'opzione ${String.fromCharCode(65 + index)}`}
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    aria-label={`Rimuovi opzione ${String.fromCharCode(65 + index)}`}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Parameters Grid: Time Horizon & Risk Tolerance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Orizzonte Temporale
            </label>
            <select
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Breve termine (giorni/settimane)">Breve termine (giorni / settimane)</option>
              <option value="Medio termine (mesi)">Medio termine (mesi)</option>
              <option value="Lungo termine (anni)">Lungo termine (anni)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Propensione al Rischio
            </label>
            <select
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Bassa (Prudente)">Bassa (Prudente, protezione del downside)</option>
              <option value="Bilanciata">Bilanciata (Equilibrio rischio / rendimento)</option>
              <option value="Alta (Audace)">Alta (Audace, massimizzazione dell'upside)</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>L'Oracolo sta consultando i dati e formulando la matrice...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 transition-transform group-hover:rotate-12 duration-300" />
                <span>Interroga l'Oracolo & Genera Valutazione</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
