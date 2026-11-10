import React, { useState } from 'react';
import { Plus, ThumbsUp, ThumbsDown, Sliders, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { OptionAnalysis, ProConItem } from '../types';

interface ProsConsTabProps {
  options: OptionAnalysis[];
  onOptionsChange: (updatedOptions: OptionAnalysis[]) => void;
}

export const ProsConsTab: React.FC<ProsConsTabProps> = ({ options, onOptionsChange }) => {
  const [expandedOptionId, setExpandedOptionId] = useState<string>(options[0]?.id || '');
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState<'pro' | 'con'>('pro');
  const [newImpact, setNewImpact] = useState<number>(3);
  const [newCategory, setNewCategory] = useState<ProConItem['category']>('Strategico');
  const [addingToOptionId, setAddingToOptionId] = useState<string | null>(null);

  // Calculate scores
  const getOptionScore = (opt: OptionAnalysis) => {
    const prosSum = opt.pros.reduce((acc, p) => acc + (opt.userAdjustments?.[p.id] ?? p.impact), 0);
    const consSum = opt.cons.reduce((acc, c) => acc + (opt.userAdjustments?.[c.id] ?? c.impact), 0);
    return {
      prosSum,
      consSum,
      net: prosSum - consSum,
    };
  };

  const handleImpactChange = (optId: string, itemId: string, newImpactVal: number) => {
    const updated = options.map((opt) => {
      if (opt.id !== optId) return opt;
      return {
        ...opt,
        userAdjustments: {
          ...(opt.userAdjustments || {}),
          [itemId]: newImpactVal,
        },
      };
    });
    onOptionsChange(updated);
  };

  const handleRemoveItem = (optId: string, itemId: string, type: 'pro' | 'con') => {
    const updated = options.map((opt) => {
      if (opt.id !== optId) return opt;
      if (type === 'pro') {
        return { ...opt, pros: opt.pros.filter((p) => p.id !== itemId) };
      } else {
        return { ...opt, cons: opt.cons.filter((c) => c.id !== itemId) };
      }
    });
    onOptionsChange(updated);
  };

  const handleAddItem = (e: React.FormEvent, optId: string) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newItem: ProConItem = {
      id: `custom-${Date.now()}`,
      text: newText.trim(),
      impact: newImpact,
      category: newCategory,
      explanation: 'Punto personalizzato aggiunto dall\'utente.',
    };

    const updated = options.map((opt) => {
      if (opt.id !== optId) return opt;
      return {
        ...opt,
        pros: newType === 'pro' ? [...opt.pros, newItem] : opt.pros,
        cons: newType === 'con' ? [...opt.cons, newItem] : opt.cons,
      };
    });

    onOptionsChange(updated);
    setNewText('');
    setAddingToOptionId(null);
  };

  return (
    <div className="space-y-8">
      {/* Overview Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((opt, idx) => {
          const { prosSum, consSum, net } = getOptionScore(opt);
          const isExpanded = expandedOptionId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setExpandedOptionId(opt.id)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-mono">Opzione {String.fromCharCode(65 + idx)}</span>
                <span className={`font-mono font-bold text-sm ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  Bilancio Netto: {net > 0 ? `+${net}` : net}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-3 line-clamp-1">
                {opt.name}
              </h3>
              
              {/* Dual Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="text-emerald-400 font-mono">+{prosSum} Pro</span>
                  <span className="text-rose-400 font-mono">-{consSum} Contro</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 transition-all duration-300"
                    style={{
                      width: `${prosSum + consSum > 0 ? (prosSum / (prosSum + consSum)) * 100 : 50}%`,
                    }}
                  />
                  <div
                    className="bg-rose-500 transition-all duration-300"
                    style={{
                      width: `${prosSum + consSum > 0 ? (consSum / (prosSum + consSum)) * 100 : 50}%`,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Analysis of the Active Option */}
      {options
        .filter((opt) => opt.id === expandedOptionId)
        .map((opt) => {
          const { prosSum, consSum, net } = getOptionScore(opt);

          return (
            <div key={opt.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs text-indigo-400 mb-1">
                    <span className="font-mono uppercase">Valutazione Ponderata</span>
                    <span aria-hidden="true">·</span>
                    <span>Modifica i pesi in tempo reale</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{opt.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">{opt.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 uppercase font-mono">Punteggio Netto</div>
                    <div className={`text-2xl font-bold font-mono ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {net > 0 ? `+${net}` : net} pt
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddingToOptionId(opt.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Aggiungi Voce</span>
                  </button>
                </div>
              </div>

              {/* Add Item Modal / Inline Drawer */}
              {addingToOptionId === opt.id && (
                <form
                  onSubmit={(e) => handleAddItem(e, opt.id)}
                  className="p-5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Aggiungi nuova considerazione</span>
                    <button
                      type="button"
                      onClick={() => setAddingToOptionId(null)}
                      className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      Annulla
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Descrivi il punto (es: Minore tempo di spostamento giornaliero)"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as 'pro' | 'con')}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="pro">Vantaggio (+ Pro)</option>
                        <option value="con">Svantaggio (- Contro)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Impatto / Gravità (1-5): <span className="text-indigo-400 font-mono font-bold">{newImpact}</span>
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={newImpact}
                        onChange={(e) => setNewImpact(parseInt(e.target.value, 10))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Categoria</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Finanziario">Finanziario</option>
                        <option value="Carriera">Carriera</option>
                        <option value="Personale">Personale</option>
                        <option value="Tempo">Tempo</option>
                        <option value="Rischio">Rischio</option>
                        <option value="Strategico">Strategico</option>
                        <option value="Altro">Altro</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
                    >
                      Salva nella lista
                    </button>
                  </div>
                </form>
              )}

              {/* Two Column Pros vs Cons Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PROS COLUMN */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Vantaggi & Opportunità ({opt.pros.length})</span>
                    </div>
                    <span className="text-xs text-emerald-400/80 font-mono">+{prosSum} pt</span>
                  </div>

                  <div className="space-y-3">
                    {opt.pros.map((pro) => {
                      const currentWeight = opt.userAdjustments?.[pro.id] ?? pro.impact;
                      return (
                        <div
                          key={pro.id}
                          className="p-4 rounded-xl bg-slate-950/60 border border-emerald-950/60 hover:border-emerald-800/60 transition-all space-y-2 group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                <span className="text-emerald-400 font-medium">{pro.category}</span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono">Impatto: {currentWeight}/5</span>
                              </div>
                              <h4 className="text-sm font-semibold text-slate-100">{pro.text}</h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(opt.id, pro.id, 'pro')}
                              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-1 cursor-pointer"
                              title="Rimuovi questo pro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {pro.explanation && (
                            <p className="text-xs text-slate-400 leading-relaxed">{pro.explanation}</p>
                          )}

                          {/* Impact Slider */}
                          <div className="pt-2 flex items-center gap-3">
                            <span className="text-[11px] text-slate-500 font-mono shrink-0">Peso impatto:</span>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              value={currentWeight}
                              onChange={(e) => handleImpactChange(opt.id, pro.id, parseInt(e.target.value, 10))}
                              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <span className="text-xs font-mono font-bold text-emerald-400 w-4 text-right">
                              {currentWeight}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CONS COLUMN */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-rose-900/50">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                      <ThumbsDown className="w-4 h-4" />
                      <span>Svantaggi & Rischi ({opt.cons.length})</span>
                    </div>
                    <span className="text-xs text-rose-400/80 font-mono">-{consSum} pt</span>
                  </div>

                  <div className="space-y-3">
                    {opt.cons.map((con) => {
                      const currentWeight = opt.userAdjustments?.[con.id] ?? con.impact;
                      return (
                        <div
                          key={con.id}
                          className="p-4 rounded-xl bg-slate-950/60 border border-rose-950/60 hover:border-rose-800/60 transition-all space-y-2 group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                <span className="text-rose-400 font-medium">{con.category}</span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono">Gravità: {currentWeight}/5</span>
                              </div>
                              <h4 className="text-sm font-semibold text-slate-100">{con.text}</h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(opt.id, con.id, 'con')}
                              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-1 cursor-pointer"
                              title="Rimuovi questo contro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {con.explanation && (
                            <p className="text-xs text-slate-400 leading-relaxed">{con.explanation}</p>
                          )}

                          {/* Impact Slider */}
                          <div className="pt-2 flex items-center gap-3">
                            <span className="text-[11px] text-slate-500 font-mono shrink-0">Gravità costo:</span>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              value={currentWeight}
                              onChange={(e) => handleImpactChange(opt.id, con.id, parseInt(e.target.value, 10))}
                              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                            <span className="text-xs font-mono font-bold text-rose-400 w-4 text-right">
                              {currentWeight}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
