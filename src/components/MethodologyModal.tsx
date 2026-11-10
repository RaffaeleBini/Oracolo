import React from 'react';
import { X, BookOpen, Scale, Grid, Shield, Brain, Coins } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Metodologia dell'Oracolo</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed">
          <p className="text-base text-slate-200">
            <strong>Oracolo</strong> fonde modelli consolidati di economia comportamentale, teoria dei giochi
            e psicologia cognitiva con la capacità sintetica dell'intelligenza artificiale avanzata per guidarti
            verso scelte lucide, replicabili e prive di rimpianti.
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>1. Bilancio Pro e Contro Ponderato (Algebra Morale)</span>
              </div>
              <p className="text-xs text-slate-400">
                Ispirato al metodo ideato da Benjamin Franklin nel 1772: invece di contare banalmente il numero di pro e contro,
                ciascuna voce riceve un punteggio di magnitudo ed impatto (1-5). Questo impedisce che 10 vantaggi insignificanti
                nascondano un unico svantaggio catastrofico.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white">
                <Grid className="w-4 h-4 text-indigo-400" />
                <span>2. Matrice Comparativa Multi-Criterio (MCDA)</span>
              </div>
              <p className="text-xs text-slate-400">
                La Multi-Criteria Decision Analysis pondera le opzioni su parametri cardine (es. ritorno economico, serenità mentale,
                reversibilità). Puoi calibrare i pesi con gli slider per testare la solidità della graduatoria.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white">
                <Shield className="w-4 h-4 text-sky-400" />
                <span>3. Analisi SWOT Strategica</span>
              </div>
              <p className="text-xs text-slate-400">
                Scompone ogni percorso tra fattori interni (Forze e Debolezze che dipendono da te) e fattori esterni
                (Opportunità e Minacce generate dal contesto o mercato).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white">
                <Brain className="w-4 h-4 text-amber-400" />
                <span>4. De-Biasing & Il "Pre-Mortem" di Gary Klein</span>
              </div>
              <p className="text-xs text-slate-400">
                Identifica trappole cognitive diffuse come la <em>Sunk Cost Fallacy</em> (costi irrecuperabili) o lo <em>Status Quo Bias</em>.
                La tecnica del Pre-Mortem simula il fallimento a 12 mesi per formulare salvaguardie preventive concrete prima di iniziare.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span>5. Il Paradosso della Moneta (La Verità Intuitiva)</span>
              </div>
              <p className="text-xs text-slate-400">
                Quando la mente razionale è paralizzata dall'eccesso di analisi, il lancio di una moneta funge da specchio
                emotivo: l'emozione provata mentre la moneta ruota rivela all'istante la preferenza subconscia.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
          >
            Ho compreso il metodo
          </button>
        </div>
      </div>
    </div>
  );
};
