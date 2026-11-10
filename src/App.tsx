import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisView } from './components/AnalysisView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { MethodologyModal } from './components/MethodologyModal';
import { DecisionAnalysis, DecisionInput } from './types';
import { Compass, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'oracolo_saved_decisions_v1';

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<DecisionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  // Load saved decisions from localStorage
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysis[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse saved decisions:', e);
      return [];
    }
  });

  // Persist saved decisions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDecisions));
    } catch (e) {
      console.error('Failed to save decisions to storage:', e);
    }
  }, [savedDecisions]);

  const handleAnalyze = async (input: DecisionInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Errore nella generazione dell\'analisi decisionale.');
      }

      const data: DecisionAnalysis = await res.json();
      setCurrentAnalysis(data);

      // Automatically add to saved archive
      setSavedDecisions((prev) => {
        const filtered = prev.filter((d) => d.id !== data.id);
        return [data, ...filtered];
      });

      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error during analysis:', err);
      setError(err.message || 'Si è verificato un errore imprevisto. Riprova tra poco.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAnalysis = (updated: DecisionAnalysis) => {
    setCurrentAnalysis(updated);
    setSavedDecisions((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  };

  const handleDeleteDecision = (id: string) => {
    setSavedDecisions((prev) => prev.filter((d) => d.id !== id));
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null);
    }
  };

  const handleClearAllDecisions = () => {
    if (window.confirm('Sei sicuro di voler cancellare tutto l\'archivio delle decisioni?')) {
      setSavedDecisions([]);
      setCurrentAnalysis(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Bar Header */}
      <Header
        onNewDecision={() => {
          setCurrentAnalysis(null);
          setError(null);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        savedCount={savedDecisions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Error Notification Bar */}
        {error && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <div className="flex-1">{error}</div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-xs underline hover:text-white cursor-pointer"
              >
                Chiudi
              </button>
            </div>
          </div>
        )}

        {/* View Switcher: Decision Form vs Analysis View */}
        {currentAnalysis ? (
          <AnalysisView
            analysis={currentAnalysis}
            onNewDecision={() => setCurrentAnalysis(null)}
            onUpdateAnalysis={handleUpdateAnalysis}
          />
        ) : (
          <DecisionForm onSubmit={handleAnalyze} isLoading={isLoading} />
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={(dec) => {
          setCurrentAnalysis(dec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeleteDecision={handleDeleteDecision}
        onClearAll={handleClearAllDecisions}
      />

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 font-['Cinzel',serif] font-bold">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Oracolo</span>
            <span className="font-sans font-normal text-slate-500 text-[11px]">· Decision Engine</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Metodologia Scientifica
            </button>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Archivio Decisioni
            </button>
            <button
              onClick={() => setCurrentAnalysis(null)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Nuovo Dilemma
            </button>
          </div>
          <div>Modelli Razionali & Intelligenza Artificiale per Scelte Senza Rimorsi</div>
        </div>
      </footer>
    </div>
  );
}
