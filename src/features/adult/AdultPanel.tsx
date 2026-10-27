import type { Locale, Problem } from '../../content/problems';
import './adult.css';

type Attempt = { answerInput: string; correct: boolean; createdAt: string };
export type AdultProgressEntry = {
  attempts: number;
  solved: boolean;
  hints: number;
  history: Attempt[];
};

export type AdultPanelProps = {
  locale: Locale;
  problems: Problem[];
  entries: Record<string, AdultProgressEntry>;
  onBack: () => void;
  onSelectProblem: (problemId: string) => void;
};

const copy = {
  ca: {
    back: 'Torna als nivells', eyebrow: 'ESPAI D’ACOMPANYAMENT', title: 'Acompanyar el progrés',
    introduction: 'Una mirada al que s’ha practicat en aquest dispositiu.',
    notice: 'Aquesta informació és una ajuda per acompanyar la pràctica, no un diagnòstic. Fer servir pistes o necessitar més intents també forma part d’aprendre.',
    level: 'Nivell', levels: ['Sumem i restem', 'Dobles, meitats i complements', 'Problemes de dos passos', 'Multipliquem i repartim', 'El repte final'],
    solved: 'Problemes resolts', first: 'Encertats al primer intent', hints: 'Pistes consultades', review: 'Per repassar',
    explanation: 'Problemes començats que encara no estan resolts o que han necessitat més d’un intent o alguna pista.',
    noReview: 'Encara no hi ha problemes per repassar en aquest nivell.',
    unsolved: 'Pendent', attempted: 'Més d’un intent', usedHints: 'Amb pistes', open: 'Obre el problema',
    local: 'El progrés només es guarda en aquest navegador i dispositiu.',
  },
  es: {
    back: 'Volver a los niveles', eyebrow: 'ESPACIO DE ACOMPAÑAMIENTO', title: 'Acompañar el progreso',
    introduction: 'Una mirada a lo que se ha practicado en este dispositivo.',
    notice: 'Esta información ayuda a acompañar la práctica, no es un diagnóstico. Usar pistas o necesitar más intentos también forma parte de aprender.',
    level: 'Nivel', levels: ['Sumamos y restamos', 'Dobles, mitades y complementos', 'Problemas de dos pasos', 'Multiplicamos y repartimos', 'El reto final'],
    solved: 'Problemas resueltos', first: 'Acertados al primer intento', hints: 'Pistas consultadas', review: 'Para repasar',
    explanation: 'Problemas empezados que aún no están resueltos o que han necesitado más de un intento o alguna pista.',
    noReview: 'Todavía no hay problemas para repasar en este nivel.',
    unsolved: 'Pendiente', attempted: 'Más de un intento', usedHints: 'Con pistas', open: 'Abrir el problema',
    local: 'El progreso solo se guarda en este navegador y dispositivo.',
  },
} as const;

export function AdultPanel({ locale, problems, entries, onBack, onSelectProblem }: AdultPanelProps) {
  const t = copy[locale];
  return <section className="adult-panel" aria-labelledby="adult-panel-title">
    <button type="button" className="adult-back" onClick={onBack}>← {t.back}</button>
    <header className="adult-heading">
      <span className="adult-eyebrow">{t.eyebrow}</span>
      <h1 id="adult-panel-title">{t.title}</h1>
      <p>{t.introduction}</p>
    </header>
    <p className="adult-notice">{t.notice}</p>
    <div className="adult-levels">
      {t.levels.map((name, index) => {
        const levelProblems = problems.filter(problem => problem.level === index + 1);
        const reviewed = levelProblems.filter(problem => {
          const entry = entries[problem.id];
          return entry && (entry.attempts > 0 || entry.hints > 0) && (!entry.solved || entry.attempts > 1 || entry.hints > 0);
        });
        const solved = levelProblems.filter(problem => entries[problem.id]?.solved).length;
        const first = levelProblems.filter(problem => entries[problem.id]?.history[0]?.correct === true).length;
        const hints = levelProblems.reduce((sum, problem) => sum + (entries[problem.id]?.hints ?? 0), 0);
        return <article className="adult-level" key={index}>
          <h2><span>{t.level} {index + 1}</span>{name}</h2>
          <dl className="adult-metrics">
            <div><dt>{t.solved}</dt><dd>{solved} / {levelProblems.length}</dd></div>
            <div><dt>{t.first}</dt><dd>{first}</dd></div>
            <div><dt>{t.hints}</dt><dd>{hints}</dd></div>
          </dl>
          <h3>{t.review}</h3>
          {reviewed.length ? <ul className="adult-review-list">{reviewed.map(problem => {
            const entry = entries[problem.id];
            const flags = [!entry.solved ? t.unsolved : '', entry.attempts > 1 ? t.attempted : '', entry.hints > 0 ? t.usedHints : ''].filter(Boolean);
            return <li key={problem.id}>
              <div><strong>{problem.title[locale]}</strong><span>{flags.join(' · ')}</span></div>
              <button type="button" onClick={() => onSelectProblem(problem.id)} aria-label={`${t.open}: ${problem.title[locale]}`}>{t.open} →</button>
            </li>;
          })}</ul> : <p className="adult-empty">{t.noReview}</p>}
        </article>;
      })}
    </div>
    <p className="adult-footnote">{t.explanation} {t.local}</p>
  </section>;
}
