---
estado: en desarrollo (prototipo funzionale importato da Google AI Studio, non ancora deployato)
pendientes: sin deploy ni repositorio Git propio; README ancora quello generico di AI Studio; sin test automatici; persistenza solo in localStorage
---

# Oracolo — Decision Assistant

App web che aiuta a valutare decisioni con l'IA: l'utente descrive una scelta (titolo, contesto, opzioni, tolleranza al rischio, orizzonte temporale) e riceve un'analisi strutturata con elenchi ponderati di pro e contro, tabella comparativa, analisi SWOT e un verdetto finale. Generata in origine con Google AI Studio (`metadata.json`).

## Stato attuale

Prototipo funzionante in locale (`npm run dev`, porta 3000). Funzionalità presenti:

- Form decisione con preset di esempio (carriera, finanza personale, business & startup) in `src/data/presets.ts`
- Vista analisi a schede: Pro/Contro, Matrice comparativa, SWOT, Verdetto
- Storico delle decisioni salvate (drawer) in `localStorage`
- Modale di metodologia e "Coin Test" (test della moneta per far emergere la preferenza istintiva)
- Backend Express (`server.ts`) con `POST /api/analyze-decision` e `GET /api/health`; chiama Gemini con una catena di modelli di fallback e valida la risposta JSON

Non risulta ancora deployato (nessun URL di produzione) e la cartella non è ancora sotto versionamento Git indipendente.

## Stack tecnico

React 19 + Vite + TypeScript, Tailwind CSS v4, Motion, lucide-react, canvas-confetti; Express + `tsx` lato server; `@google/genai` per le chiamate a Gemini (chiave `GEMINI_API_KEY` in `.env.local`, mai nel frontend).

## Struttura

- `server.ts` — server Express + middleware Vite, endpoint di analisi e health check
- `src/App.tsx` — stato globale e persistenza dello storico
- `src/components/` — `DecisionForm`, `AnalysisView`, `ProsConsTab`, `ComparisonMatrixTab`, `SWOTTab`, `VerdictTab`, `HistoryDrawer`, `MethodologyModal`, `CoinTestModal`, `Header`
- `src/types.ts`, `src/data/presets.ts` — modello dati e preset

## Prossimi passi suggeriti

1. Inizializzare un repo Git indipendente (come fatto per Gamification) e sostituire il README di AI Studio
2. Scegliere hosting per il deploy (serve un server Node per proteggere la chiave Gemini; Vercel statico non basta senza adattare l'endpoint)
3. Aggiungere test sul parsing/validazione della risposta di Gemini
