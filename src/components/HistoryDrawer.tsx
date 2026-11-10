import React from 'react';
import { X, Clock, Trash2, ArrowRight, Compass, Calendar } from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Archivio delle Decisioni</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Compass className="w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-400" />
              <p className="text-sm">Nessuna decisione archiviata finora.</p>
              <p className="text-xs text-slate-600 mt-1">
                Le decisioni che analizzerai verranno salvate automaticamente in memoria.
              </p>
            </div>
          ) : (
            savedDecisions.map((dec) => {
              const formattedDate = new Date(dec.createdAt).toLocaleDateString('it-IT', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={dec.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>
                    <span>{dec.options.length} opzioni</span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200 line-clamp-2 group-hover:text-white transition-colors">
                    {dec.title}
                  </h4>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDecision(dec);
                        onClose();
                      }}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Apri Analisi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteDecision(dec.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      title="Elimina dall'archivio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {savedDecisions.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-mono">
              Totale salvate: {savedDecisions.length}
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
            >
              Svuota Archivio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
