export interface ProConItem {
  id: string;
  text: string;
  impact: number; // 1 to 5
  category: 'Finanziario' | 'Carriera' | 'Personale' | 'Tempo' | 'Rischio' | 'Strategico' | 'Altro';
  explanation?: string;
}

export interface OptionAnalysis {
  id: string;
  name: string;
  description: string;
  pros: ProConItem[];
  cons: ProConItem[];
  userAdjustments?: {
    [itemId: string]: number; // override weight
  };
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number; // 1 to 10
}

export interface OptionCriterionScore {
  optionId: string;
  score: number; // 1 to 10
  rationale: string;
}

export interface MatrixRow {
  criterion: Criterion;
  scores: {
    [optionId: string]: OptionCriterionScore;
  };
}

export interface SWOTQuad {
  title: string;
  items: Array<{
    point: string;
    detail: string;
    severityOrImpact?: 'alto' | 'medio' | 'basso';
  }>;
}

export interface OptionSWOT {
  optionId: string;
  optionName: string;
  strengths: SWOTQuad['items'];
  weaknesses: SWOTQuad['items'];
  opportunities: SWOTQuad['items'];
  threats: SWOTQuad['items'];
}

export interface ActionStep {
  timeframe: string; // e.g. "Prime 24-48 ore", "Entro 30 giorni", "Entro 90 giorni"
  action: string;
  expectedOutcome: string;
}

export interface BlindSpot {
  bias: string;
  warning: string;
  suggestion: string;
}

export interface DecisionVerdict {
  recommendedOptionId: string;
  recommendationTitle: string;
  executiveSummary: string;
  keyDrivers: string[];
  blindSpots: BlindSpot[];
  preMortem: {
    riskScenario: string;
    preventativeAction: string;
  };
  actionPlan: ActionStep[];
  confidenceScore: number; // 1 to 100
}

export interface DecisionAnalysis {
  id: string;
  title: string;
  context: string;
  createdAt: string;
  options: OptionAnalysis[];
  criteriaMatrix: {
    criteria: Criterion[];
    matrix: MatrixRow[];
  };
  swot: OptionSWOT[];
  verdict: DecisionVerdict;
}

export interface DecisionInput {
  title: string;
  context: string;
  options: string[]; // At least 2 options recommended, or 1 option (e.g. "Fare X o non fare X")
  criteriaNotes?: string;
  timeHorizon?: 'Breve termine (giorni/settimane)' | 'Medio termine (mesi)' | 'Lungo termine (anni)';
  riskTolerance?: 'Bassa (Prudente)' | 'Bilanciata' | 'Alta (Audace)';
}

export interface PresetDecision {
  id: string;
  title: string;
  category: string;
  context: string;
  options: string[];
  riskTolerance: 'Bassa (Prudente)' | 'Bilanciata' | 'Alta (Audace)';
  timeHorizon: 'Breve termine (giorni/settimane)' | 'Medio termine (mesi)' | 'Lungo termine (anni)';
}
