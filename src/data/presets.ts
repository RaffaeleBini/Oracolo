import { PresetDecision } from '../types';

export const DECISION_PRESETS: PresetDecision[] = [
  {
    id: 'career-move',
    title: 'Accettare offerta in una Scale-up estera o rimanere nella posizione attuale?',
    category: 'Carriera',
    context: 'Lavoro da 3 anni come team lead in un\'azienda consolidata con stipendio sicuro e buon equilibrio vita-lavoro. Ho ricevuto un\'offerta da una scale-up a Zurigo con +35% di retribuzione lorda, stock options, ma orari più intensi e necessità di trasferimento.',
    options: [
      'Accettare l\'offerta e trasferirsi a Zurigo',
      'Rimanere nell\'azienda attuale rinegoziando ruolo e stipendio',
      'Cercare un compromesso: offerta con contratto ibrido/full remote',
    ],
    riskTolerance: 'Bilanciata',
    timeHorizon: 'Lungo termine (anni)',
  },
  {
    id: 'house-buy-vs-rent',
    title: 'Acquistare la prima casa con mutuo o continuare in affitto investendo il capitale?',
    category: 'Finanza Personale',
    context: 'Disponibilità di 60.000€ di risparmi. Tassi di interesse attuali attorno al 3.2%. Desiderio di stabilità abitativa contro il beneficio della liquidità e flessibilità di movimento nei prossimi 5 anni.',
    options: [
      'Acquistare trilocale con mutuo a 25 anni e rata fissa',
      'Rimanere in affitto e investire i 60k in un portafoglio azionario/obbligazionario diversificato',
    ],
    riskTolerance: 'Bassa (Prudente)',
    timeHorizon: 'Lungo termine (anni)',
  },
  {
    id: 'product-launch',
    title: 'Lanciare subito un MVP imperfetto o perfezionare il prodotto per altri 3 mesi?',
    category: 'Business & Startup',
    context: 'La nostra web app per freelance ha le 3 funzioni core funzionanti ma mancano alcune integrazioni avanzate e il design presenta qualche imperfezione. I competitor stanno accelerando.',
    options: [
      'Lancio immediato in beta pubblica con sconto early adopter',
      'Rinvio del lancio di 90 giorni per completare integrazioni e test di carico',
      'Rilascio privato solo a 50 utenti selezionati per raccogliere feedback prima del lancio aperto',
    ],
    riskTolerance: 'Alta (Audace)',
    timeHorizon: 'Breve termine (giorni/settimane)',
  },
  {
    id: 'tech-stack-rewrite',
    title: 'Riscrivere il software legacy da zero o procedere con un refactoring modulare?',
    category: 'Tecnologia & Architettura',
    context: 'Il codebase ha 6 anni, debito tecnico accumulato e rilasci lenti. Un rewrite completo promette architettura moderna e velocità futura, ma rischia di bloccare le nuove feature per 8 mesi.',
    options: [
      'Rewrite da zero con stack moderno (Next.js/TypeScript/Cloud)',
      'Refactoring incrementale con pattern Strangler Fig modulo per modulo',
    ],
    riskTolerance: 'Bilanciata',
    timeHorizon: 'Medio termine (mesi)',
  },
];
