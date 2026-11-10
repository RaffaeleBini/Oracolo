import React, { useState } from 'react';
import { Coins, RotateCcw, X, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OptionAnalysis } from '../types';

interface CoinTestModalProps {
  options: OptionAnalysis[];
  isOpen: boolean;
  onClose: () => void;
}

export const CoinTestModal: React.FC<CoinTestModalProps> = ({ options, isOpen, onClose }) => {
  const [optA, setOptA] = useState<string>(options[0]?.id || '');
  const [optB, setOptB] = useState<string>(options[1]?.id || options[0]?.id || '');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'A' | 'B' | null>(null);
  const [flipCount, setFlipCount] = useState(0);

  if (!isOpen) return null;

  const optionAObj = options.find((o) => o.id === optA) || options[0];
  const optionBObj = options.find((o) => o.id === optB) || options[1] || options[0];

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    // Random choice between A and B
    const outcome: 'A' | 'B' = Math.random() > 0.5 ? 'A' : 'B';

    setTimeout(() => {
      setResult(outcome);
      setIsFlipping(false);
      setFlipCount((prev) => prev + 1);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: outcome === 'A' ? ['#6366f1', '#818cf8'] : ['#a855f7', '#c084fc'],
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-indigo-400 mb-2">
            <Coins className="w-4 h-4" />
            <span>Esperimento Psicologico dell'Oracolo</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Il Paradosso della Moneta
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Quando lanci una moneta, il vero valore non è il risultato, ma ciò che speri che esca
            mentre è ancora in volo.
          </p>
        </div>

        {/* Options Assignment */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3 rounded-xl bg-slate-950 border border-indigo-900/60">
            <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase block mb-1">
              Testa (Opzione 1)
            </span>
            <div className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-2">
              {optionAObj?.name}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-violet-900/60">
            <span className="text-[11px] font-mono font-bold text-violet-400 uppercase block mb-1">
              Croce (Opzione 2)
            </span>
            <div className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-2">
              {optionBObj?.name}
            </div>
          </div>
        </div>

        {/* Animated Coin */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div
            className={`w-28 h-28 rounded-full border-4 border-amber-400/80 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-xl shadow-amber-500/20 flex items-center justify-center text-slate-950 font-extrabold text-xl font-['Cinzel',serif] select-none transition-transform duration-700 ${
              isFlipping ? 'animate-bounce [transform:rotateY(720deg)]' : ''
            }`}
          >
            {isFlipping ? '...' : result ? (result === 'A' ? 'TESTA' : 'CROCE') : 'ORACOLO'}
          </div>

          {result && !isFlipping && (
            <div className="mt-5 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-center animate-in zoom-in-95 duration-200">
              <div className="text-xs text-indigo-300 font-mono uppercase mb-1">
                La moneta è atterrata su:
              </div>
              <div className="text-lg font-bold text-white mb-2">
                {result === 'A' ? optionAObj?.name : optionBObj?.name}
              </div>
              <div className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto italic">
                «Ascolta la tua reazione istintiva: hai provato sollievo o una sottile delusione?
                Quella sensazione istantanea è la voce del tuo intuito profondo.»
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleFlip}
            disabled={isFlipping}
            className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <Coins className="w-4 h-4" />
            <span>{isFlipping ? 'La moneta è in volo...' : result ? 'Lancia di Nuovo' : 'Lancia la Moneta'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
          >
            Ho compreso
          </button>
        </div>
      </div>
    </div>
  );
};
