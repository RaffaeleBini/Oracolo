# Oracolo — Assistente decisionale

Applicazione web che ti aiuta a prendere decisioni difficili. Descrivi la decisione, le opzioni che stai valutando e il tuo profilo di rischio, e Oracolo genera un'analisi strutturata con intelligenza artificiale (Google Gemini) per confrontarle con metodo.

> L'interfaccia e le analisi generate sono in **italiano**.

## Cosa fa

Per ogni decisione, Oracolo restituisce un report con quattro viste:

| Vista | Contenuto |
|---|---|
| **Pro / Contro** | Elenchi ponderati per impatto (1–5) e categoria (Finanziario, Carriera, Personale, Tempo, Rischio, Strategico). Puoi modificare i pesi a mano. |
| **Matrice comparativa** | Opzioni valutate (1–10) rispetto a criteri con peso, con la motivazione di ogni voto. |
| **SWOT** | Punti di forza, debolezze, opportunità e minacce di ciascuna opzione. |
| **Verdetto** | Raccomandazione finale e piano d'azione per scadenze. |

Inoltre:

- **Esempi precaricati** (carriera, finanza personale, business e startup) per provare l'app senza scrivere nulla.
- **Storico** delle decisioni salvate, accessibile da un pannello laterale.
- **Test della moneta**: lanci una moneta tra due opzioni per capire quale preferenza istintiva ti suscita il risultato.
- **Metodologia**: finestra che spiega come viene costruita l'analisi.
- **Esportazione**: copia il report completo in Markdown oppure stampalo / salvalo come PDF.

## Come si usa

1. **Scrivi la decisione** nel campo del titolo (ad esempio: «Dovrei accettare la nuova proposta di lavoro o restare nel mio ruolo attuale?»). È l'unico campo obbligatorio.
2. **Aggiungi il contesto** (facoltativo): vincoli economici, familiari o di tempo e il tuo obiettivo a 1–3 anni.
3. **Indica le opzioni** che stai considerando. Se non ne inserisci nessuna, Oracolo confronta «procedere» con «mantenere lo stato attuale».
4. **Scegli l'orizzonte temporale** (breve, medio o lungo termine) e la **propensione al rischio** (bassa, bilanciata o alta).
5. **Avvia l'analisi** e naviga tra le schede del report.
6. **Ritrova la decisione più tardi** dallo storico: ogni analisi viene salvata automaticamente. I dati restano solo nel browser (`localStorage`); non ci sono account né database.

## Installazione ed esecuzione in locale

Requisiti: [Node.js](https://nodejs.org/) (oppure [Bun](https://bun.sh/), il repo include `bun.lock`) e, facoltativamente, una chiave API di Gemini.

```bash
# 1. Installare le dipendenze
npm install

# 2. Configurare la chiave di Gemini (facoltativo, vedi nota sotto)
echo "GEMINI_API_KEY=la_tua_chiave" > .env.local

# 3. Avviare in modalità sviluppo
npm run dev
```

L'app è disponibile su <http://localhost:3000> (la porta si può cambiare con la variabile `PORT`).

> **Senza chiave API.** Se non definisci `GEMINI_API_KEY`, l'app funziona comunque, ma il server restituisce un'analisi generata da regole a partire dai tuoi dati, non dall'IA. Per analisi reali con Gemini la chiave è necessaria. Puoi ottenerla da [Google AI Studio](https://aistudio.google.com/apikey).

La chiave è usata solo dal server Express: non viene mai inviata al browser.

### Verificare che il server funzioni

```bash
curl http://localhost:3000/api/health
```

Risponde con lo stato e con l'indicazione se è configurata una chiave (`hasApiKey`).

### Build ed esecuzione in produzione

```bash
npm run build
NODE_ENV=production npx tsx server.ts
```

Il server Express serve i file statici di `dist/` ed espone l'API. Serve un ambiente con Node.js: un hosting solo statico non basta, perché la chiave di Gemini deve restare sul server.

## Script

| Comando | Azione |
|---|---|
| `npm run dev` | Server Express con Vite integrato (sviluppo) |
| `npm run build` | Compila il frontend in `dist/` |
| `npm run lint` | Controllo dei tipi con TypeScript |
| `npm run clean` | Elimina `dist/` e `server.js` |

## Tecnologie

React 19 · Vite · TypeScript · Tailwind CSS v4 · Motion · Express · `@google/genai`

## Struttura

```
server.ts            Server Express: POST /api/analyze-decision e GET /api/health
src/App.tsx          Stato globale e storico
src/components/      Form, viste del report, storico, metodologia, test della moneta
src/data/presets.ts  Esempi precaricati
src/types.ts         Modello dati dell'analisi
```
