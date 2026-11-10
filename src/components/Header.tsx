import React from 'react';
import { Compass, Sparkles, History, BookOpen, PlusCircle } from 'lucide-react';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onOpenMethodology: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenHistory,
  onOpenMethodology,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={onNewDecision}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-md"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Compass className="w-4 h-4 transition-transform group-hover:rotate-45 duration-300" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-['Cinzel',serif] whitespace-nowrap shrink-0">
            Oracolo
          </span>
        </button>

        {/* Zone 2: Navigation Links (4-5 single-line clean text links) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={onNewDecision}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Nuova Decisione
          </button>
          <button
            onClick={onOpenHistory}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Archivio Decisioni</span>
            {savedCount > 0 && (
              <span className="text-xs text-indigo-400 font-mono">({savedCount})</span>
            )}
          </button>
          <button
            onClick={onOpenMethodology}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Metodologia</span>
          </button>
          <a
            href="#framework"
            onClick={(e) => {
              e.preventDefault();
              onOpenMethodology();
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Teoria delle Decisioni
          </a>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewDecision}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/30 transition-all duration-150 whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nuova Analisi</span>
          </button>
        </div>
      </div>
    </header>
  );
};
