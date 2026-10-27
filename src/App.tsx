import { useEffect, useRef, useState } from "react";
import { problems, type Locale, type Problem } from "./content/problems";
import { illustrationFor as getIllustration } from "./content/illustrations";
import { VisualLab } from "./visual";
import { AdultPanel } from "./features/adult/AdultPanel";
import { homeChangelog } from "./features/home/config/changelog";
import { changelogTranslations } from "./features/home/config/translations";
import "./practice.css";

type Attempt = { answerInput: string; correct: boolean; createdAt: string };
type Entry = {
  attempts: number;
  history: Attempt[];
  solved: boolean;
  hints: number;
  solution: boolean;
  draft: string;
};
type Progress = { current?: string; entries: Record<string, Entry> };
const empty: Entry = {
  attempts: 0,
  history: [],
  solved: false,
  hints: 0,
  solution: false,
  draft: "",
};
const key = "math-practice:v2";
const localeKey = "math-practice:locale:v1";
const words = {
  ca: {
    brand: "Matemàtiques per pensar",
    tagline: "Un petit espai per a les grans idees",
    home: "Inici",
    intro: "Cada problema és una aventura per pensar.",
    description:
      "Llegeix amb calma, prova les teves idees i descobreix diferents maneres d’arribar a la resposta.",
    choose: "Tria el teu camí",
    chooseSub: "Cinc nivells per descobrir, al teu ritme.",
    levels: [
      "Sumem i restem",
      "Dobles, meitats i complements",
      "Problemes de dos passos",
      "Multipliquem i repartim",
      "El repte final",
    ],
    labels: [
      "Fem els primers salts",
      "Busquem relacions",
      "Un pas i després un altre",
      "Agrupem i compartim",
      "Barregem les idees",
    ],
    problems: "problemes",
    solved: "resolts",
    start: "Comença",
    continue: "Continua",
    reset: "Reinicia el progrés",
    resetConfirm:
      "Vols esborrar tot el progrés d’aquest dispositiu? Aquesta acció no es pot desfer.",
    cancel: "Cancel·la",
    confirm: "Sí, reinicia",
    back: "Torna als nivells",
    problem: "Problema",
    of: "de",
    know: "Què sabem?",
    facts:
      "Llegeix el que explica la història i fixa’t en què et pregunta. Quines dades et poden ajudar?",
    answerLabel: "La teva resposta",
    check: "Comprova",
    hint: "Necessito una pista",
    hints: "Pistes per pensar",
    solution: "Veure una possible solució",
    hideSolution: "Amaga la solució",
    correct: "Molt bé! Com ho has pensat?",
    incorrect: "Encara no. Revisa les dades i torna-ho a provar.",
    invalid: "Escriu un nombre enter, sense paraules ni signes addicionals.",
    next: "Següent problema",
    previous: "Anterior",
    finish: "Veure el resum",
    summary: "Mira tot el que has practicat!",
    summaryText:
      "Cada intent és una oportunitat per aprendre. Pots tornar a qualsevol problema sempre que vulguis.",
    mastered: "Dominat",
    practice: "Segueix practicant",
    recommendation: "Ja pots provar el nivell següent!",
    retry: "Torna a practicar",
    nextLevel: "Següent nivell",
    allLevels: "Tots els nivells",
    level: "Nivell",
    completed: "Problemes resolts",
    reviewList: "Problemes per revisar",
    reviewNone: "Has resolt tots els problemes d’aquest nivell.",
    help: "Les pistes són per ajudar-te. Fer-les servir no resta punts.",
    imageAlt: "Una taula de classe amb llibres, fruita i material escolar.",
    imageLabel: "Un món de petites històries",
    levelDone: "Has acabat el recorregut",
    first: "Comença a explorar",
    resume: "Continua explorant",
    problemList: "Problemes del nivell",
    solvedMark: "Resolt",
    unsolved: "Per descobrir",
    saveWarning: "No hem pogut desar el progrés en aquest navegador.",
    adult: "Espai d’acompanyament",
  },
  es: {
    brand: "Matemáticas para pensar",
    tagline: "Un pequeño espacio para las grandes ideas",
    home: "Inicio",
    intro: "Cada problema es una aventura para pensar.",
    description:
      "Lee con calma, prueba tus ideas y descubre diferentes maneras de llegar a la respuesta.",
    choose: "Elige tu camino",
    chooseSub: "Cinco niveles para descubrir, a tu ritmo.",
    levels: [
      "Sumamos y restamos",
      "Dobles, mitades y complementos",
      "Problemas de dos pasos",
      "Multiplicamos y repartimos",
      "El reto final",
    ],
    labels: [
      "Damos los primeros saltos",
      "Buscamos relaciones",
      "Un paso y después otro",
      "Agrupamos y compartimos",
      "Mezclamos las ideas",
    ],
    problems: "problemas",
    solved: "resueltos",
    start: "Empieza",
    continue: "Continúa",
    reset: "Reiniciar el progreso",
    resetConfirm:
      "¿Quieres borrar todo el progreso de este dispositivo? Esta acción no se puede deshacer.",
    cancel: "Cancelar",
    confirm: "Sí, reiniciar",
    back: "Volver a los niveles",
    problem: "Problema",
    of: "de",
    know: "¿Qué sabemos?",
    facts:
      "Lee lo que cuenta la historia y fíjate en qué te pregunta. ¿Qué datos te pueden ayudar?",
    answerLabel: "Tu respuesta",
    check: "Comprobar",
    hint: "Necesito una pista",
    hints: "Pistas para pensar",
    solution: "Ver una posible solución",
    hideSolution: "Ocultar la solución",
    correct: "¡Muy bien! ¿Cómo lo has pensado?",
    incorrect: "Todavía no. Revisa los datos e inténtalo de nuevo.",
    invalid: "Escribe un número entero, sin palabras ni signos adicionales.",
    next: "Siguiente problema",
    previous: "Anterior",
    finish: "Ver el resumen",
    summary: "¡Mira todo lo que has practicado!",
    summaryText:
      "Cada intento es una oportunidad para aprender. Puedes volver a cualquier problema cuando quieras.",
    mastered: "Dominado",
    practice: "Sigue practicando",
    recommendation: "¡Ya puedes probar el siguiente nivel!",
    retry: "Volver a practicar",
    nextLevel: "Siguiente nivel",
    allLevels: "Todos los niveles",
    level: "Nivel",
    completed: "Problemas resueltos",
    reviewList: "Problemas para revisar",
    reviewNone: "Has resuelto todos los problemas de este nivel.",
    help: "Las pistas están para ayudarte. Usarlas no resta puntos.",
    imageAlt: "Una mesa de clase con libros, fruta y material escolar.",
    imageLabel: "Un mundo de pequeñas historias",
    levelDone: "Has terminado el recorrido",
    first: "Empieza a explorar",
    resume: "Continúa explorando",
    problemList: "Problemas del nivel",
    solvedMark: "Resuelto",
    unsolved: "Por descubrir",
    saveWarning: "No hemos podido guardar el progreso en este navegador.",
    adult: "Espacio de acompañamiento",
  },
};

function loadProgress(): Progress {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) {
      const legacy = JSON.parse(
        localStorage.getItem("math-practice:v1") ?? "null",
      );
      if (
        legacy &&
        legacy.schemaVersion === 1 &&
        Array.isArray(legacy.attempts) &&
        Array.isArray(legacy.completedProblemIds)
      ) {
        const entries: Record<string, Entry> = {};
        for (const p of problems) {
          const history: Attempt[] = legacy.attempts
            .filter((a: { problemId?: string }) => a.problemId === p.id)
            .filter(
              (a: Attempt) =>
                typeof a.answerInput === "string" &&
                typeof a.correct === "boolean" &&
                typeof a.createdAt === "string",
            )
            .map((a: Attempt) => ({
              answerInput: a.answerInput,
              correct: a.correct,
              createdAt: a.createdAt,
            }));
          if (history.length || legacy.completedProblemIds.includes(p.id))
            entries[p.id] = {
              ...empty,
              history,
              attempts: history.length,
              solved:
                history.some((a) => a.correct) ||
                legacy.completedProblemIds.includes(p.id),
              hints: Math.max(0, Math.min(3, ...legacy.attempts.filter((a: { problemId?: string }) => a.problemId === p.id).map((a: { hintsUsed?: unknown }) => typeof a.hintsUsed === "number" && Number.isInteger(a.hintsUsed) ? a.hintsUsed : 0))),
            };
        }
        return {
          entries,
          current: problems.some((p) => p.id === legacy.currentProblemId)
            ? legacy.currentProblemId
            : undefined,
        };
      }
    }
    const value: unknown = JSON.parse(saved ?? "null");
    if (
      !value ||
      typeof value !== "object" ||
      !("entries" in value) ||
      !value.entries ||
      typeof value.entries !== "object"
    )
      return { entries: {} };
    const entries: Record<string, Entry> = {};
    for (const [id, raw] of Object.entries(value.entries)) {
      if (!problems.some((p) => p.id === id) || !raw || typeof raw !== "object")
        continue;
      const e = raw as Entry;
      if (
        typeof e.solved === "boolean" &&
        Number.isInteger(e.attempts) &&
        e.attempts >= 0 &&
        Number.isInteger(e.hints) &&
        e.hints >= 0 &&
        e.hints <= 3 &&
        typeof e.solution === "boolean"
      )
        entries[id] = {
          ...e,
          draft: typeof e.draft === "string" ? e.draft.slice(0, 100) : "",
          history: Array.isArray(e.history)
            ? e.history.filter(
                (a) =>
                  a &&
                  typeof a.answerInput === "string" &&
                  typeof a.correct === "boolean" &&
                  typeof a.createdAt === "string",
              )
            : [],
        };
    }
    const current =
      "current" in value &&
      typeof value.current === "string" &&
      problems.some((p) => p.id === value.current)
        ? value.current
        : undefined;
    return { entries, current };
  } catch {
    return { entries: {} };
  }
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      return localStorage.getItem(localeKey) === "es" ? "es" : "ca";
    } catch {
      return "ca";
    }
  });
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [view, setView] = useState<"home" | "problem" | "summary" | "adult">("home");
  const [level, setLevel] = useState(1);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<
    "correct" | "incorrect" | "invalid" | null
  >(null);
  const [showFacts, setShowFacts] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [storageError, setStorageError] = useState(false);
  const t = words[locale];
  const list = problems.filter((p) => p.level === level);
  const problem: Problem = list[index];
  const illustration = problem ? getIllustration(problem.id, locale) : null;
  const entry = problem ? (progress.entries[problem.id] ?? empty) : empty;
  const count = (n: number) =>
    problems.filter((p) => p.level === n && progress.entries[p.id]?.solved)
      .length;
  const total = count(level);
  const review = list.filter((p) => !progress.entries[p.id]?.solved);
  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(localeKey, locale);
    } catch {
      setStorageError(true);
    }
  }, [locale]);
  useEffect(() => {
    if (view !== "home") headingRef.current?.focus({ preventScroll: true });
  }, [view, index]);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify({ schemaVersion: 2, ...progress }));
    } catch {
      setStorageError(true);
    }
  }, [progress]);
  function move(n: number) {
    setIndex(n);
    setAnswer(progress.entries[list[n]?.id]?.draft ?? "");
    setFeedback(null);
    setShowFacts(false);
    setShowSolution(false);
    const p = list[n];
    if (p) setProgress((old) => ({ ...old, current: p.id }));
    window.scrollTo(0, 0);
  }
  function openLevel(n: number) {
    const ps = problems.filter((p) => p.level === n);
    const current = ps.findIndex((p) => p.id === progress.current);
    const unsolved = ps.findIndex((p) => !progress.entries[p.id]?.solved);
    const selected = current >= 0 ? current : Math.max(0, unsolved);
    setLevel(n);
    setIndex(selected);
    setAnswer(progress.entries[ps[selected].id]?.draft ?? "");
    setProgress((old) => ({ ...old, current: ps[selected].id }));
    setFeedback(null);
    setShowFacts(false);
    setShowSolution(false);
    setView("problem");
    window.scrollTo(0, 0);
  }
  function openProblem(id: string) {
    const target = problems.find(p => p.id === id);
    if (!target) return;
    const targetList = problems.filter(p => p.level === target.level);
    setLevel(target.level);
    setIndex(targetList.findIndex(p => p.id === id));
    setAnswer(progress.entries[id]?.draft ?? "");
    setFeedback(null);
    setShowFacts(false);
    setShowSolution(false);
    setProgress(old => ({ ...old, current: id }));
    setView("problem");
    window.scrollTo(0, 0);
  }
  function updateEntry(change: Partial<Entry>) {
    setProgress((old) => ({
      ...old,
      current: problem.id,
      entries: {
        ...old.entries,
        [problem.id]: { ...(old.entries[problem.id] ?? empty), ...change },
      },
    }));
  }
  function checkAnswer() {
    const value = answer.trim();
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value))) {
      setFeedback("invalid");
      return;
    }
    const correct = Number(value) === problem.answer.value;
    updateEntry({
      attempts: entry.attempts + 1,
      history: [
        ...entry.history,
        { answerInput: value, correct, createdAt: new Date().toISOString() },
      ],
      solved: entry.solved || correct,
    });
    setFeedback(correct ? "correct" : "incorrect");
  }
  function closeReset() {
    setConfirmReset(false);
    requestAnimationFrame(() => resetButtonRef.current?.focus());
  }
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => setView("home")}
            aria-label={t.home}
          >
            <span className="brand-symbol">✳</span>
            <span>
              <strong>{t.brand}</strong>
              <small>{t.tagline}</small>
            </span>
          </button>
          <div className="language" aria-label="Idioma / Idioma">
            <button
              aria-pressed={locale === "ca"}
              onClick={() => setLocale("ca")}
            >
              CAT
            </button>
            <button
              aria-pressed={locale === "es"}
              onClick={() => setLocale("es")}
            >
              CAS
            </button>
          </div>
        </div>
      </header>
      <main className="page">
        {storageError && (
          <p role="alert" className="storage-warning">
            {t.saveWarning}
          </p>
        )}
        {view === "home" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">
                  <span className="dot" />{" "}
                  {locale === "ca"
                    ? "PENSA · PROVA · DESCOBREIX"
                    : "PIENSA · PRUEBA · DESCUBRE"}
                </span>
                <h1>{t.intro}</h1>
                <p>{t.description}</p>
                <a className="button primary" href="#levels">
                  {t.first} <span aria-hidden="true">↗</span>
                </a>
                <div className="hero-note">
                  <span>✦</span>{" "}
                  {locale === "ca"
                    ? "Sense presses. Hi ha moltes maneres de pensar."
                    : "Sin prisas. Hay muchas maneras de pensar."}
                </div>
              </div>
              <div className="hero-art">
                <img src="/illustrations/classroom.jpg" alt={t.imageAlt} />
                <span className="art-label">✳ &nbsp; {t.imageLabel}</span>
              </div>
            </section>
            <section className="levels" id="levels">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    {locale === "ca" ? "EL TEU QUADERN" : "TU CUADERNO"}
                  </span>
                  <h2>{t.choose}</h2>
                  <p>{t.chooseSub}</p>
                </div>
                <span className="section-spark" aria-hidden="true">
                  ✳
                </span>
              </div>
              <div className="level-grid">
                {t.levels.map((name, i) => (
                  <article className={`level-card level-${i + 1}`} key={name}>
                    <div className="card-top">
                      <span className="level-number">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="card-icon" aria-hidden="true">
                        {["＋", "½", "↗", "▦", "✳"][i]}
                      </span>
                    </div>
                    <span className="card-kicker">
                      {t.level} {i + 1} · {t.labels[i]}
                    </span>
                    <h3>{name}</h3>
                    <div className="card-bottom">
                      <span>
                        {count(i + 1)}/12 {t.solved}
                      </span>
                      <button onClick={() => openLevel(i + 1)}>
                        {problems.some(p => p.level === i + 1 && progress.entries[p.id]) || progress.current?.startsWith(`L${i + 1}-`) ? t.continue : t.start}{" "}
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                    <div className="progress-track">
                      <span
                        style={{ width: `${(count(i + 1) / 12) * 100}%` }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <div className="reset-area">
              <details className="home-changelog">
                <summary>{changelogTranslations[locale].title}</summary>
                {homeChangelog.map((release) => <p key={release.version}><strong>{release.version}</strong> · {new Intl.DateTimeFormat(locale === 'ca' ? 'ca-ES' : 'es-ES', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${release.date}T12:00:00Z`))}<br />{changelogTranslations[locale][release.translationKey]}</p>)}
              </details>
              <button className="link-button" onClick={() => { setView("adult"); window.scrollTo(0, 0); }}>{t.adult}</button>
              <button
                className="link-button"
                ref={resetButtonRef}
                onClick={() => setConfirmReset(true)}
              >
                {t.reset}
              </button>
            </div>
          </>
        )}
        {view === "adult" && <AdultPanel locale={locale} problems={problems} entries={progress.entries} onBack={() => setView("home")} onSelectProblem={openProblem} />}
        {view === "problem" && problem && (
          <>
            <button className="back-link" onClick={() => setView("home")}>
              ← {t.back}
            </button>
            <div className="practice-header">
              <div>
                <span className="eyebrow">
                  {t.level} {level} · {t.levels[level - 1]}
                </span>
                <h1 ref={headingRef} tabIndex={-1}>{problem.title[locale]}</h1>
              </div>
              <div className="problem-count">
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <span>
                  / 12
                  <br />
                  {t.problems}
                </span>
              </div>
            </div>
            <div className="progress-track large">
              <span style={{ width: `${((index + 1) / 12) * 100}%` }} />
            </div>
            <div className="practice-grid">
              <div>
                <section className="story-card">
                  <span className="story-label">
                    ✳ &nbsp; {locale === "ca" ? "LA HISTÒRIA" : "LA HISTORIA"}
                  </span>
                  <p className="statement">{showFacts ? problem.statement[locale].split(/(\d+)/).map((part, i) => /^\d+$/.test(part) ? <mark key={i}>{part}</mark> : part) : problem.statement[locale]}</p>
                  <h2 className={showFacts ? "question-highlight" : undefined}>{problem.question[locale]}</h2>
                  <button
                    className="subtle-button"
                    onClick={() => setShowFacts(!showFacts)}
                    aria-expanded={showFacts}
                  >
                    ◉ &nbsp; {t.know}
                  </button>
                  {showFacts && <p className="facts">{t.facts}</p>}
                </section>
                <section className="answer-card">
                  <label htmlFor="answer">{t.answerLabel}</label>
                  <div className="answer-row">
                    <input
                      id="answer"
                      inputMode="numeric"
                      aria-describedby="answer-unit"
                      value={answer}
                      onChange={(e) => { const draft = e.target.value.slice(0, 100); setAnswer(draft); updateEntry({ draft }); setFeedback(null); }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") checkAnswer();
                      }}
                    />
                    <span id="answer-unit">{problem.answer.unit[locale]}</span>
                    <button className="button primary" onClick={checkAnswer}>
                      {t.check} →
                    </button>
                  </div>
                  <div
                    className={`feedback ${feedback ?? ""}`}
                    aria-live="polite"
                  >
                    {feedback && t[feedback]}
                  </div>
                </section>
                <section className="hint-card">
                  <div>
                    <span className="hint-icon">✦</span>
                    <div>
                      <h2>{t.hints}</h2>
                      <p>{t.help}</p>
                    </div>
                  </div>
                  <ol>
                    {problem.hints.slice(0, entry.hints).map((h, i) => (
                      <li key={i}>{h[locale]}</li>
                    ))}
                  </ol>
                  {entry.hints < 3 && (
                    <button
                      className="subtle-button"
                      onClick={() => updateEntry({ hints: entry.hints + 1 })}
                    >
                      {t.hint} · {entry.hints}/3
                    </button>
                  )}
                  {(entry.hints === 3 || entry.solved || entry.solution) && (
                    <>
                      <button
                        className="link-button solution-toggle"
                        onClick={() => {
                          setShowSolution(!showSolution);
                          if (!showSolution) updateEntry({ solution: true });
                        }}
                      >
                        {showSolution ? t.hideSolution : t.solution}{" "}
                        {showSolution ? "−" : "+"}
                      </button>
                      {showSolution && (
                        <p className="solution">
                          {problem.workedSolution[locale]}
                        </p>
                      )}
                    </>
                  )}
                </section>
                <nav className="problem-nav">
                  <button
                    className="subtle-button"
                    disabled={index === 0}
                    onClick={() => move(index - 1)}
                  >
                    ← {t.previous}
                  </button>
                  <button
                    className="button primary"
                    onClick={() =>
                      index < 11
                        ? move(index + 1)
                        : (setView("summary"), window.scrollTo(0, 0))
                    }
                  >
                    {index < 11 ? t.next : t.finish} →
                  </button>
                </nav>
              </div>
              <aside>
                {illustration && <div className="context-art">
                  <img
                    src={illustration.src}
                    alt={illustration.alt}
                    loading="lazy"
                  />
                  <span>{t.imageLabel} ✳</span>
                </div>}
                <VisualLab
                  key={problem.id}
                  locale={locale}
                  suggestedModel={problem.visualModel}
                />
                <div className="problem-list">
                  <h2>{t.problemList}</h2>
                  <div>
                    {list.map((p, i) => (
                      <button
                        key={p.id}
                        className={`${i === index ? "active" : ""} ${progress.entries[p.id]?.solved ? "done" : ""}`}
                        onClick={() => move(i)}
                        aria-label={`${t.problem} ${i + 1}: ${progress.entries[p.id]?.solved ? t.solvedMark : t.unsolved}`}
                        aria-current={i === index ? "step" : undefined}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
        {view === "summary" && (
          <section className="summary-card">
            <span className="summary-star">✳</span>
            <span className="eyebrow">
              {t.levelDone} · {t.level} {level}
            </span>
            <h1 ref={headingRef} tabIndex={-1}>{t.summary}</h1>
            <p>{t.summaryText}</p>
            <div className="summary-number">
              <strong>{total}</strong>
              <span>
                / 12
                <br />
                {t.completed}
              </span>
            </div>
            <p className="summary-status">
              {total >= 10 ? t.mastered : t.practice}
            </p>
            {total >= 8 && level < 5 && <p>{t.recommendation}</p>}
            <div className="review-list">
              <h2>{t.reviewList}</h2>
              {review.length ? <ul>{review.map((p) => <li key={p.id}><button className="link-button" onClick={() => { setView("problem"); move(list.findIndex(item => item.id === p.id)); }}>{p.title[locale]}</button></li>)}</ul> : <p>{t.reviewNone}</p>}
            </div>
            <div className="summary-actions">
              <button
                className="subtle-button"
                onClick={() => {
                  setView("problem");
                  move(Math.max(0, list.findIndex((p) => !progress.entries[p.id]?.solved)));
                }}
              >
                {t.retry}
              </button>
              {level < 5 && (
                <button
                  className="button primary"
                  onClick={() => openLevel(level + 1)}
                >
                  {t.nextLevel} →
                </button>
              )}
              <button className="link-button" onClick={() => setView("home")}>
                {t.allLevels}
              </button>
            </div>
          </section>
        )}
      </main>
      <footer>
        <span>✳ &nbsp; {t.brand}</span>
        <span>
          {locale === "ca"
            ? "Fet per pensar, al teu ritme."
            : "Hecho para pensar, a tu ritmo."}
        </span>
      </footer>
      {confirmReset && (
        <div className="modal-backdrop" onClick={closeReset}>
          <div
            className="modal"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeReset();
              if (e.key === "Tab") {
                const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
                if (!buttons?.length) return;
                if (e.shiftKey && document.activeElement === buttons[0]) { e.preventDefault(); buttons[buttons.length - 1].focus(); }
                else if (!e.shiftKey && document.activeElement === buttons[buttons.length - 1]) { e.preventDefault(); buttons[0].focus(); }
              }
            }}
          >
            <h2 id="reset-title">{t.reset}</h2>
            <p>{t.resetConfirm}</p>
            <div>
              <button
                className="subtle-button"
                autoFocus
                onClick={closeReset}
              >
                {t.cancel}
              </button>
              <button
                className="button primary"
                onClick={() => {
                  try { localStorage.removeItem("math-practice:v1"); } catch { setStorageError(true); }
                  setProgress({ entries: {} });
                  closeReset();
                }}
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
