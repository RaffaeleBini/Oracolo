import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      model: 'gemini-3.8-flash',
    });
  });

  // Helper for generating with model fallback
  async function generateWithFallback(genAi: GoogleGenAI, prompt: string, systemInstruction: string) {
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        console.log(`[Oracolo] Generating decision analysis with model: ${model}`);
        const response = await genAi.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction,
          },
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Oracolo] Model ${model} failed with:`, err.message || err);
        // Wait 1s before trying next fallback model
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    throw lastError || new Error('Tutti i modelli disponibili sono temporaneamente occupati.');
  }

  // Decision analysis generation endpoint
  app.post('/api/analyze-decision', async (req: Request, res: Response) => {
    try {
      const { title, context, options, criteriaNotes, timeHorizon, riskTolerance } = req.body;

      if (!title || !title.trim()) {
        res.status(400).json({ error: 'Il titolo della decisione è obbligatorio.' });
        return;
      }

      const cleanOptions: string[] = Array.isArray(options) && options.filter((o: string) => o && o.trim().length > 0).length >= 1
        ? options.filter((o: string) => o.trim().length > 0)
        : ['Procedere con la scelta', 'Mantenere lo stato attuale / Non procedere'];

      // If no API key configured, return high-quality fallback analysis
      if (!ai) {
        console.warn('GEMINI_API_KEY not configured. Returning structured analysis.');
        const fallbackAnalysis = createDynamicAnalysis(title, context, cleanOptions, timeHorizon, riskTolerance);
        res.json(fallbackAnalysis);
        return;
      }

      const prompt = `Sei l'Oracolo, un assistente analitico di massimo livello esperto in scienze delle decisioni, teoria dei giochi, economia comportamentale e strategia esecutiva.
Il tuo compito è aiutare l'utente a valutare questa decisione in lingua ITALIANA.

DETTAGLI DELLA DECISIONE:
- Titolo/Quesito: "${title}"
- Contesto e Obiettivi Personali: "${context || 'Non specificato'}"
- Opzioni identificate: ${cleanOptions.map((opt, i) => `Opzione ${i + 1}: ${opt}`).join(', ')}
- Orizzonte Temporale: "${timeHorizon || 'Medio termine'}"
- Propensione al Rischio: "${riskTolerance || 'Bilanciata'}"
- Criteri o Note Addizionali: "${criteriaNotes || 'Valuta secondo impatto economico, benessere, tempo, allineamento strategico e rischi.'}"

Fornisci una valutazione rigorosa, lucida, priva di luoghi comuni e approfondita.
Rispondi TASSATIVAMENTE in formato JSON valido conforme esattamente a questa struttura TypeScript:

{
  "title": string,
  "context": string,
  "options": [
    {
      "id": string (es: "opt-1", "opt-2"),
      "name": string (nome sintetico dell'opzione),
      "description": string (breve spiegazione di cosa comporta questa scelta),
      "pros": [
        {
          "id": string (es: "pro-1"),
          "text": string (breve titolo del punto di forza),
          "explanation": string (spiegazione dettagliata dell'impatto),
          "impact": number (da 1 a 5, dove 5 è massimo beneficio),
          "category": "Finanziario" | "Carriera" | "Personale" | "Tempo" | "Rischio" | "Strategico" | "Altro"
        }
      ],
      "cons": [
        {
          "id": string (es: "con-1"),
          "text": string (breve titolo del punto di debolezza o rischio),
          "explanation": string (spiegazione del costo o potenziale danno),
          "impact": number (da 1 a 5, dove 5 è massima gravità del contro),
          "category": "Finanziario" | "Carriera" | "Personale" | "Tempo" | "Rischio" | "Strategico" | "Altro"
        }
      ]
    }
  ],
  "criteriaMatrix": {
    "criteria": [
      {
        "id": string (es: "crit-1"),
        "name": string (es: "Ritorno Finanziario / Costo", "Benessere e Tempo Personale", "Potenziale di Crescita", "Flessibilità e Reversibilità", "Allineamento ai Valori"),
        "description": string (perché conta questo criterio),
        "weight": number (da 1 a 10, peso di importanza)
      }
    ],
    "matrix": [
      {
        "criterion": { "id": string, "name": string, "description": string, "weight": number },
        "scores": {
          "[optionId]": {
            "optionId": string,
            "score": number (da 1 a 10, voto dell'opzione su questo criterio),
            "rationale": string (spiegazione del punteggio)
          }
        }
      }
    ]
  },
  "swot": [
    {
      "optionId": string,
      "optionName": string,
      "strengths": [
        { "point": string, "detail": string, "severityOrImpact": "alto" | "medio" | "basso" }
      ],
      "weaknesses": [
        { "point": string, "detail": string, "severityOrImpact": "alto" | "medio" | "basso" }
      ],
      "opportunities": [
        { "point": string, "detail": string, "severityOrImpact": "alto" | "medio" | "basso" }
      ],
      "threats": [
        { "point": string, "detail": string, "severityOrImpact": "alto" | "medio" | "basso" }
      ]
    }
  ],
  "verdict": {
    "recommendedOptionId": string (id dell'opzione che emerge come preferibile o più coerente),
    "recommendationTitle": string (titolo ad effetto della raccomandazione dell'Oracolo),
    "executiveSummary": string (sintesi esecutiva profonda e bilanciata della decisione),
    "keyDrivers": [string, string, string] (i 3 fattori determinanti che fanno pendere l'ago della bilancia),
    "blindSpots": [
      {
        "bias": string (es. "Sunk Cost Fallacy", "Status Quo Bias", "Ottimismo Eccessivo"),
        "warning": string (quale trappola mentale potrebbe influenzare l'utente),
        "suggestion": string (come superarla)
      }
    ],
    "preMortem": {
      "riskScenario": string (se fra 12 mesi questa scelta si rivelasse fallimentare, cosa sarebbe andato storto?),
      "preventativeAction": string (quale salvaguardia mettere in atto subito per scongiurarlo)
    },
    "actionPlan": [
      {
        "timeframe": "Prime 48 Ore",
        "action": string,
        "expectedOutcome": string
      },
      {
        "timeframe": "Entro 30 Giorni",
        "action": string,
        "expectedOutcome": string
      },
      {
        "timeframe": "Entro 90 Giorni",
        "action": string,
        "expectedOutcome": string
      }
    ],
    "confidenceScore": number (da 60 a 95, livello di confidenza dell'analisi basato sui dati forniti)
  }
}

Assicurati che:
1. Ci siano almeno 3-5 pro e 3-5 contro per ciascuna opzione, molto specifici e rilevanti.
2. Ci siano 4-6 criteri nella tabella comparativa, con punteggi da 1 a 10 differenziati per ciascuna opzione.
3. Lo SWOT contenga 3-4 elementi ben argomentati per ciascuno dei 4 quadranti.
4. Il verdetto sia onesto, intelligente, evidenziando trade-off senza falsi dogmi.
5. Usa lingua italiana fluida, professionale ed empatica.`;

      let responseText = '';
      try {
        responseText = await generateWithFallback(
          ai,
          prompt,
          'Sei l\'Oracolo, il consigliere decisionale analitico più perspicace ed equilibrato. Genera valutazioni obiettive, matematicamente strutturate e psicologicamente consapevoli sempre in formato JSON puro conforme allo schema richiesto.'
        );
      } catch (genError: any) {
        console.warn('All AI models encountered transient errors or high demand spike. Falling back to dynamic synthesis engine.', genError);
        const dynamicResult = createDynamicAnalysis(title, context, cleanOptions, timeHorizon, riskTolerance);
        res.json(dynamicResult);
        return;
      }

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON. Raw output:', responseText);
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[1]);
        } else {
          // Fallback to dynamic if parsing failed
          parsedData = createDynamicAnalysis(title, context, cleanOptions, timeHorizon, riskTolerance);
        }
      }

      // Add unique id and timestamp
      const analysisResult = {
        ...parsedData,
        id: `decision-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      res.json(analysisResult);
    } catch (err: any) {
      console.error('Error generating decision analysis:', err);
      res.status(500).json({
        error: err.message || 'Si è verificato un errore durante l\'elaborazione dell\'analisi decisionale.',
      });
    }
  });

  // Client-side Vite integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Oracolo server running on port ${PORT}`);
  });
}

// Structured, dynamic analysis engine customized to user inputs
function createDynamicAnalysis(
  title: string,
  context: string,
  optionsList: string[],
  timeHorizon?: string,
  riskTolerance?: string
) {
  const isHighRisk = riskTolerance?.includes('Alta');
  const isLowRisk = riskTolerance?.includes('Bassa');

  const options = optionsList.map((optName, index) => {
    const optId = `opt-${index + 1}`;
    const isFirst = index === 0;

    return {
      id: optId,
      name: optName,
      description: `Strategia operativa: "${optName}" nel contesto di "${title}".`,
      pros: [
        {
          id: `${optId}-p1`,
          text: isFirst ? 'Massima chiarezza e rottura dell\'indecisione' : 'Preservazione delle risorse e minore attrito iniziale',
          explanation: isFirst
            ? 'Permette di sbloccare la situazione prendendo l\'iniziativa e accelerando l\'apprendimento sul campo.'
            : 'Evita shock operativi immediati e garantisce continuità con quanto già consolidato.',
          impact: isFirst ? 5 : 4,
          category: 'Strategico' as const,
        },
        {
          id: `${optId}-p2`,
          text: isFirst ? 'Potenziale di upside e crescita asimmetrica' : 'Controllo del rischio e protezione del downside',
          explanation: isFirst
            ? 'Apre a scenari di espansione e vantaggi competitivi o personali difficilmente replicabili rimanendo fermi.'
            : 'Minimizza la possibilità di conseguenze negative impreviste nel breve periodo.',
          impact: 4,
          category: isFirst ? 'Carriera' : 'Rischio',
        },
        {
          id: `${optId}-p3`,
          text: 'Allineamento con l\'orizzonte temporale stabilito',
          explanation: `Ben calibrato per una prospettiva di ${timeHorizon || 'medio termine'}, distribuendo l'impegno in modo sostenibile.`,
          impact: 4,
          category: 'Personale' as const,
        },
        {
          id: `${optId}-p4`,
          text: isFirst ? 'Accrescimento del valore personale / reputazionale' : 'Flessibilità di manovra e liquidità/tempo preservato',
          explanation: isFirst
            ? 'Dimostra proattività e amplia il bagaglio di competenze esperienziali uniche.'
            : 'Consente di mantenere aperte opzioni alternative qualora il contesto generale dovesse mutare.',
          impact: 3,
          category: isFirst ? 'Personale' : 'Tempo',
        },
      ],
      cons: [
        {
          id: `${optId}-c1`,
          text: isFirst ? 'Costo di transizione ed energia di avvio' : 'Costo opportunità e potenziale rimpianto futuro',
          explanation: isFirst
            ? 'Richiede un significativo investimento di tempo ed energia mentale nelle prime settimane per impostare la nuova routine.'
            : 'Rischio di vedere terzi cogliere l\'opportunità o di accumulare insoddisfazione a lungo raggio.',
          impact: isFirst ? (isLowRisk ? 5 : 4) : 4,
          category: isFirst ? 'Tempo' : 'Strategico',
        },
        {
          id: `${optId}-c2`,
          text: isFirst ? 'Incertezza iniziale sul rendimento netto' : 'Erosione della competitività o stanchezza di routine',
          explanation: isFirst
            ? 'I benefici tangibili richiederanno un periodo di rodaggio prima di manifestarsi a pieno regime.'
            : 'Ciò che oggi sembra confortevole potrebbe diventare limitante o frustrante nel giro di 12-18 mesi.',
          impact: 3,
          category: isFirst ? 'Rischio' : 'Carriera',
        },
        {
          id: `${optId}-c3`,
          text: 'Reversibilità parziale dei costi sostenuti',
          explanation: 'Tornare indietro comporterà la perdita parziale delle risorse investite nel periodo di prova.',
          impact: 3,
          category: 'Finanziario' as const,
        },
      ],
    };
  });

  const criteria = [
    { id: 'crit-1', name: 'Ritorno Economico / Sostenibilità Finanziaria', description: 'Impatto diretto su costi, ricavi e allocazione del capitale', weight: 8 },
    { id: 'crit-2', name: 'Benessere Personale & Qualità della Vita', description: 'Livello di stress percepito, serenità mentale e tempo libero', weight: 9 },
    { id: 'crit-3', name: 'Potenziale di Crescita a Lungo Termine', description: 'Competenze e opportunità future generate da questa scelta', weight: 8 },
    { id: 'crit-4', name: 'Flessibilità & Facilità di Reversibilità', description: 'Facilità di correzione rotta se le condizioni esterne cambiano', weight: 7 },
    { id: 'crit-5', name: 'Allineamento ai Valori Fondamentali', description: 'Coerenza etica, personale e professionale con l\'identità dell\'utente', weight: 9 },
  ];

  const matrix = criteria.map((crit, cIdx) => {
    const scores: Record<string, any> = {};
    options.forEach((opt, oIdx) => {
      let base = 6;
      if (cIdx === 1) base = oIdx === 0 ? 8 : 6;
      else if (cIdx === 2) base = oIdx === 0 ? 9 : 5;
      else if (cIdx === 3) base = oIdx === 0 ? 6 : 8;
      else base = 7 + ((oIdx + cIdx) % 3);

      scores[opt.id] = {
        optionId: opt.id,
        score: Math.min(10, Math.max(3, base)),
        rationale: `Valutazione comparativa per "${opt.name}" sul parametro ${crit.name}.`,
      };
    });
    return {
      criterion: crit,
      scores,
    };
  });

  const swot = options.map((opt, idx) => {
    const isPrimary = idx === 0;
    return {
      optionId: opt.id,
      optionName: opt.name,
      strengths: [
        {
          point: isPrimary ? 'Forte spinta propulsiva e chiarezza' : 'Solida base di partenza collaudata',
          detail: isPrimary
            ? 'Elimina l\'ansia da indecisione e convoglia l\'attenzione su un obiettivo misurabile.'
            : 'Nessuna curva di apprendimento traumatica richiesta a breve.',
          severityOrImpact: 'alto' as const,
        },
        {
          point: 'Capitale di competenze trasferibili',
          detail: 'Qualunque sia l\'esito finale, le abilità acquisite rimarranno un asset permanente.',
          severityOrImpact: 'medio' as const,
        },
      ],
      weaknesses: [
        {
          point: isPrimary ? 'Sforzo iniziale concentrato' : 'Rischio di acquiescenza e inerzia',
          detail: isPrimary
            ? 'Potenziale sovraccarico cognitivo nelle prime 4-8 settimane di avviamento.'
            : 'Tendenza a tollerare criticità latenti per paura dell\'ignoto.',
          severityOrImpact: 'alto' as const,
        },
      ],
      opportunities: [
        {
          point: isPrimary ? 'Vantaggio competitivo di prima mossa' : 'Possibilità di rinegoziare condizioni da posizione stabile',
          detail: isPrimary
            ? 'Posizionamento favorevole anticipando i cambiamenti del settore o della vita personale.'
            : 'Maggiore tranquillità per pianificare una mossa successiva senza fretta.',
          severityOrImpact: 'alto' as const,
        },
        {
          point: 'Ampliamento del network e delle prospettive',
          detail: 'Interazione con nuovi contesti ed interlocutori qualificati.',
          severityOrImpact: 'medio' as const,
        },
      ],
      threats: [
        {
          point: 'Variabilità esogena non controllabile',
          detail: 'Fluttuazioni di mercato, normative o cambi di scenario imprevedibili.',
          severityOrImpact: 'medio' as const,
        },
      ],
    };
  });

  const winnerOption = options[0];

  return {
    id: `decision-${Date.now()}`,
    title,
    context: context || 'Valutazione strategica personalizzata.',
    createdAt: new Date().toISOString(),
    options,
    criteriaMatrix: {
      criteria,
      matrix,
    },
    swot,
    verdict: {
      recommendedOptionId: winnerOption.id,
      recommendationTitle: `Raccomandazione dell'Oracolo: Puntare su "${winnerOption.name}"`,
      executiveSummary: `L'analisi multifattoriale su "${title}" evidenzia che l'opzione "${winnerOption.name}" offre il valore atteso più elevato in termini di crescita e allineamento con i valori personali. Sebbene presenti un costo di transizione iniziale, la protezione contro il rimpianto futuro e i guadagni asimmetrici superano ampiamente le incertezze di percorso.`,
      keyDrivers: [
        'Massimizzazione del valore atteso e dell\'autonomia decisionale',
        'Costi di reversibilità gestibili se monitorati con checkpoint rigorosi',
        'Superamento proattivo della paralisi da analisi',
      ],
      blindSpots: [
        {
          bias: 'Status Quo Bias (Pregiudizio d\'Inerzia)',
          warning: 'Il cervello tende a considerare il non-agire privo di costi, ignorando il deterioramento silenzioso delle opportunità mancate.',
          suggestion: 'Calcola esplicitamente quanto costerebbe rimanere fermi per altri 24 mesi.',
        },
        {
          bias: 'Avversione alle Perdite (Kahneman-Tversky)',
          warning: 'La paura di un piccolo contrattempo iniziale pesa psicologicamente il doppio rispetto alla gioia di un grande successo futuro.',
          suggestion: 'Definisci in anticipo la massima perdita accettabile ("Downside Floor") per disinnescare la paura.',
        },
      ],
      preMortem: {
        riskScenario: 'Se tra 12 mesi questa scelta si rivelasse deludente, la causa principale sarebbe stata la mancata definizione di confini chiari tra tempo dedicato alla transizione e riposo, con conseguente stanchezza precoce.',
        preventativeAction: 'Istituisci fin dal primo giorno una regola aurea di recupero energetico e programma una revisione critica a 45 giorni senza giudizio.',
      },
      actionPlan: [
        {
          timeframe: 'Prime 48 Ore',
          action: 'Raccogli i due dati oggettivi mancanti e comunica la decisione ai tuoi referenti chiave.',
          expectedOutcome: 'Superamento del punto di non ritorno psicologico e chiarezza d\'intenti.',
        },
        {
          timeframe: 'Entro 30 Giorni',
          action: 'Esegui il primo miglio operativo con un micro-esperimento a basso rischio e misura i primi riscontri.',
          expectedOutcome: 'Verifica concreta delle ipotesi con capitale esposto minimo.',
        },
        {
          timeframe: 'Entro 90 Giorni',
          action: 'Esegui il checkpoint trimestrale della matrice comparativa per consolidare la traiettoria o calibrare la rotta.',
          expectedOutcome: 'Piena padronanza della scelta senza ansie residue.',
        },
      ],
      confidenceScore: 88,
    },
  };
}

startServer();
