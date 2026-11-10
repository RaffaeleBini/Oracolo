import React, { useState } from 'react';
import {
  Scale,
  Grid,
  Shield,
  Compass,
  Coins,
  Download,
  Share2,
  BookmarkCheck,
  RotateCcw,
  Check,
  Printer,
  Sparkles,
} from 'lucide-react';
import { DecisionAnalysis, OptionAnalysis } from '../types';
import { ProsConsTab } from './ProsConsTab';
import { ComparisonMatrixTab } from './ComparisonMatrixTab';
import { SWOTTab } from './SWOTTab';
import { VerdictTab } from './VerdictTab';
import { CoinTestModal } from './CoinTestModal';

interface AnalysisViewProps {
  analysis: DecisionAnalysis;
  onNewDecision: () => void;
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
}

type TabType = 'pros-cons' | 'matrix' | 'swot' | 'verdict';

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  analysis,
  onNewDecision,
  onUpdateAnalysis,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('pros-cons');
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  const handleOptionsChange = (updatedOptions: OptionAnalysis[]) => {
    onUpdateAnalysis({
      ...analysis,
      options: updatedOptions,
    });
  };

  const handleMatrixChange = (updatedMatrix: DecisionAnalysis['criteriaMatrix']) => {
    onUpdateAnalysis({
      ...analysis,
      criteriaMatrix: updatedMatrix,
    });
  };

  const handleExportMarkdown = () => {
    const md = `# ORACOLO - ANALISI DECISIONALE
Data: ${new Date(analysis.createdAt).toLocaleString('it-IT')}

## QUESITO
${analysis.title}

## CONTESTO
${analysis.context || 'Non specificato'}

---

## 1. ELENCO PRO E CONTRO PONDERATI
${analysis.options
  .map(
    (opt) => `### ${opt.name}
${opt.description}

**PRO (+):**
${opt.pros.map((p) => `- [Impatto: ${p.impact}/5] ${p.text} (${p.category}): ${p.explanation || ''}`).join('\n')}

**CONTRO (-):**
${opt.cons.map((c) => `- [Gravità: ${c.impact}/5] ${c.text} (${c.category}): ${c.explanation || ''}`).join('\n')}
`
  )
  .join('\n\n')}

---

## 2. MATRICE COMPARATIVA (MCDA)
Criteri:
${analysis.criteriaMatrix.criteria.map((c) => `- ${c.name} (Peso: ${c.weight}/10)`).join('\n')}

---

## 3. VERDETTO DELL'ORACOLO
**Raccomandazione:** ${analysis.verdict.recommendationTitle}
**Confidenza:** ${analysis.verdict.confidenceScore}%

${analysis.verdict.executiveSummary}

**Fattori Chiave:**
${analysis.verdict.keyDrivers.map((d) => `- ${d}`).join('\n')}

**Pre-Mortem a 12 Mesi:**
- Scenario di rischio: ${analysis.verdict.preMortem.riskScenario}
- Azione preventiva: ${analysis.verdict.preMortem.preventativeAction}
`;

    navigator.clipboard.writeText(md);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Executive Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
              <span>REPORT DECISIONALE</span>
              <span aria-hidden="true">·</span>
              <span>{analysis.options.length} percorsi esaminati</span>
              <span aria-hidden="true">·</span>
              <span>{new Date(analysis.createdAt).toLocaleDateString('it-IT')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {analysis.title}
            </h1>
            {analysis.context && (
              <p className="text-sm text-slate-400 mt-1 max-w-4xl line-clamp-2">
                {analysis.context}
              </p>
            )}
          </div>

          {/* Quick Action Tools */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsCoinModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              title="Test istintivo della moneta"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Test della Moneta</span>
            </button>

            <button
              type="button"
              onClick={handleExportMarkdown}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              title="Copia l'intero report in formato Markdown"
            >
              {copiedExport ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiato!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Esporta Markdown</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Stampa o salva come PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onNewDecision}
              className="px-3.5 py-2 text-xs font-semibold text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-800/60 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nuovo Dilemma</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls (Button segmented controls complying with Frontend Design constitution) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800/80 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pros-cons')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'pros-cons'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Pro e Contro Ponderati</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Matrice Comparativa Multi-Criterio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('swot')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'swot'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Analisi SWOT</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verdict')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'verdict'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Verdetto dell'Oracolo</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'pros-cons' && (
          <ProsConsTab options={analysis.options} onOptionsChange={handleOptionsChange} />
        )}
        {activeTab === 'matrix' && (
          <ComparisonMatrixTab
            matrixData={analysis.criteriaMatrix}
            options={analysis.options}
            onMatrixChange={handleMatrixChange}
          />
        )}
        {activeTab === 'swot' && <SWOTTab swotData={analysis.swot} />}
        {activeTab === 'verdict' && (
          <VerdictTab verdict={analysis.verdict} options={analysis.options} />
        )}
      </div>

      {/* Coin Test Modal */}
      <CoinTestModal
        options={analysis.options}
        isOpen={isCoinModalOpen}
        onClose={() => setIsCoinModalOpen(false)}
      />
    </div>
  );
};
