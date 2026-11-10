import React, { useState } from 'react';
import { Award, Info, Sliders, Trophy, ChevronRight } from 'lucide-react';
import { Criterion, DecisionAnalysis, OptionAnalysis } from '../types';

interface ComparisonMatrixTabProps {
  matrixData: DecisionAnalysis['criteriaMatrix'];
  options: OptionAnalysis[];
  onMatrixChange?: (updatedMatrix: DecisionAnalysis['criteriaMatrix']) => void;
}

export const ComparisonMatrixTab: React.FC<ComparisonMatrixTabProps> = ({
  matrixData,
  options,
  onMatrixChange,
}) => {
  const [criteriaWeights, setCriteriaWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    matrixData.criteria.forEach((c) => {
      initial[c.id] = c.weight;
    });
    return initial;
  });

  const [activeCellRationale, setActiveCellRationale] = useState<{
    criterionName: string;
    optionName: string;
    score: number;
    rationale: string;
  } | null>(null);

  const handleWeightChange = (criterionId: string, newWeight: number) => {
    const updatedWeights = { ...criteriaWeights, [criterionId]: newWeight };
    setCriteriaWeights(updatedWeights);

    if (onMatrixChange) {
      const updatedCriteria = matrixData.criteria.map((c) =>
        c.id === criterionId ? { ...c, weight: newWeight } : c
      );
      const updatedRows = matrixData.matrix.map((row) =>
        row.criterion.id === criterionId
          ? { ...row, criterion: { ...row.criterion, weight: newWeight } }
          : row
      );
      onMatrixChange({
        criteria: updatedCriteria,
        matrix: updatedRows,
      });
    }
  };

  // Calculate weighted score for each option
  const optionScores: Record<string, { totalWeighted: number; maxPossible: number; percentage: number }> = {};
  
  options.forEach((opt) => {
    let weightedSum = 0;
    let maxWeightedSum = 0;

    matrixData.matrix.forEach((row) => {
      const weight = criteriaWeights[row.criterion.id] ?? row.criterion.weight;
      const scoreObj = row.scores[opt.id];
      const score = scoreObj ? scoreObj.score : 5;

      weightedSum += weight * score;
      maxWeightedSum += weight * 10;
    });

    const percentage = maxWeightedSum > 0 ? Math.round((weightedSum / maxWeightedSum) * 100) : 0;
    optionScores[opt.id] = {
      totalWeighted: weightedSum,
      maxPossible: maxWeightedSum,
      percentage,
    };
  });

  // Sort options by score for leaderboard
  const rankedOptions = [...options].sort(
    (a, b) => (optionScores[b.id]?.percentage || 0) - (optionScores[a.id]?.percentage || 0)
  );

  return (
    <div className="space-y-8">
      {/* Leaderboard Podium Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1">
              <span>MATRICE MULTI-CRITERIO (MCDA)</span>
              <span aria-hidden="true">·</span>
              <span>Classifica Ponderata</span>
            </div>
            <h3 className="text-xl font-bold text-white">Graduatoria delle Scelte</h3>
          </div>
          <div className="text-xs text-slate-400">
            Regola i pesi dei criteri per testare la robustezza della scelta
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rankedOptions.map((opt, rankIndex) => {
            const scoreData = optionScores[opt.id];
            const isWinner = rankIndex === 0;

            return (
              <div
                key={opt.id}
                className={`p-4 rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {isWinner ? (
                      <Trophy className="w-4 h-4 text-amber-400" />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-mono font-bold flex items-center justify-center text-slate-300">
                        {rankIndex + 1}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-300">
                      {isWinner ? '1° Scelta Consigliata' : `${rankIndex + 1}° Classificata`}
                    </span>
                  </div>
                  <span className="text-lg font-bold font-mono text-white tabular-nums">
                    {scoreData?.percentage}%
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-100 line-clamp-1 mb-2">
                  {opt.name}
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isWinner ? 'bg-indigo-500' : 'bg-slate-500'
                    }`}
                    style={{ width: `${scoreData?.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decision Matrix Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Tabella Comparativa Dettagliata</h3>
          </div>
          <span className="text-xs text-slate-400">Fai clic su un punteggio per leggere la motivazione</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 min-w-[240px]">Criterio di Valutazione</th>
                <th className="py-4 px-4 w-[160px] text-center">Peso (1-10)</th>
                {options.map((opt) => (
                  <th key={opt.id} className="py-4 px-6 min-w-[180px]">
                    <div className="text-slate-200 font-bold normal-case text-sm truncate">
                      {opt.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {matrixData.matrix.map((row) => {
                const currentWeight = criteriaWeights[row.criterion.id] ?? row.criterion.weight;

                return (
                  <tr key={row.criterion.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-200 text-sm">{row.criterion.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{row.criterion.description}</div>
                    </td>

                    {/* Weight Slider */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={currentWeight}
                          onChange={(e) => handleWeightChange(row.criterion.id, parseInt(e.target.value, 10))}
                          className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <span className="w-6 font-mono font-bold text-xs text-indigo-300 tabular-nums">
                          {currentWeight}
                        </span>
                      </div>
                    </td>

                    {/* Option Scores */}
                    {options.map((opt) => {
                      const scoreObj = row.scores[opt.id];
                      const score = scoreObj ? scoreObj.score : 5;
                      const rationale = scoreObj?.rationale || 'Nessuna nota specifica';

                      let badgeColor = 'bg-slate-800/80 text-slate-300 border-slate-700';
                      if (score >= 8) badgeColor = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
                      else if (score <= 4) badgeColor = 'bg-rose-950/60 text-rose-300 border-rose-800/60';

                      return (
                        <td key={opt.id} className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveCellRationale({
                                criterionName: row.criterion.name,
                                optionName: opt.name,
                                score,
                                rationale,
                              })
                            }
                            className={`w-full p-2.5 rounded-xl border text-left transition-all hover:ring-2 hover:ring-indigo-400 cursor-pointer flex items-center justify-between ${badgeColor}`}
                          >
                            <span className="font-mono font-bold text-sm tabular-nums">
                              {score}/10
                            </span>
                            <Info className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            {/* Total Row */}
            <tfoot className="bg-slate-950 font-bold border-t-2 border-slate-700">
              <tr>
                <td className="py-5 px-6 text-slate-200">
                  <div className="text-sm uppercase tracking-wider font-mono">Punteggio Totale Ponderato</div>
                  <div className="text-xs text-slate-500 font-normal">Normalizzato in percentuale su 100%</div>
                </td>
                <td className="py-5 px-4 text-center font-mono text-xs text-slate-500">
                  $\Sigma$ (peso $\times$ voto)
                </td>
                {options.map((opt) => {
                  const scoreData = optionScores[opt.id];
                  const isTop = rankedOptions[0]?.id === opt.id;

                  return (
                    <td key={opt.id} className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-mono tabular-nums ${isTop ? 'text-indigo-400 font-extrabold' : 'text-slate-300'}`}>
                          {scoreData?.percentage}%
                        </span>
                        {isTop && (
                          <span className="text-xs text-indigo-400 font-mono font-normal">
                            (Top)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {scoreData?.totalWeighted} / {scoreData?.maxPossible} pt
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Rationale Popover Modal */}
      {activeCellRationale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-indigo-400 font-mono uppercase">Motivazione dell'Oracolo</span>
                <h4 className="text-base font-bold text-white">{activeCellRationale.criterionName}</h4>
              </div>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {activeCellRationale.score}/10
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                Per: {activeCellRationale.optionName}
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeCellRationale.rationale}
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveCellRationale(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
