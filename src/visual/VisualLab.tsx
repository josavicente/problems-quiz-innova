import { useId, useRef, useState } from 'react';
import './visual.css';

export type VisualModel = 'numberLine' | 'barModel' | 'array' | 'groups' | 'mixed';
export type VisualLocale = 'ca' | 'es';
type Props = { locale: VisualLocale; suggestedModel: VisualModel };
type ModelProps = { locale: VisualLocale };
type BaseModel = Exclude<VisualModel, 'mixed'>;
const baseModels: BaseModel[] = ['numberLine', 'barModel', 'array', 'groups'];

const copy = {
  ca: {
    title: 'Un espai per pensar', intro: 'Fes servir aquestes eines per organitzar les teves idees. Agafa paper i llapis per fer els càlculs.', choose: 'Tria una eina', guide: 'Com funciona aquesta eina?', selectedTool: 'Eina seleccionada',
    numberLine: 'Línia numèrica', barModel: 'Barres', array: 'Files i columnes', groups: 'Repartiment', mixed: 'Passos',
    chooseData: 'Escriu les dades del problema per començar.', rangeError: 'Escriu un nombre enter entre {min} i {max}.', known: 'Què saps?', knownTotal: 'Conec el total', knownPart: 'Conec una part', partValue: 'Quantitat de cada part', totalUnknown: 'Total per calcular',
    start: 'Punt inicial', jump: 'Salt', add: 'Afegeix el salt', undo: 'Desfés l’últim salt', clear: 'Esborra els salts', jumpList: 'Salts per dibuixar', edit: 'Edita el salt', remove: 'Elimina el salt', noJumps: 'Encara no hi ha salts.',
    lineHelp: 'Copia la línia al paper. Escriu el punt inicial, dibuixa cada salt i calcula on arribes després de cada un.', lineUnknown: 'Punt per calcular al paper',
    total: 'Quantitat total', parts: 'Parts iguals', part: 'Part', barHelp: 'Dibuixa una barra al paper i separa-la en parts iguals. Quina quantitat pots posar a cada part perquè juntes formin el total?', partHelp: 'Dibuixa les parts iguals al paper. Si coneixes la quantitat de cada part, quina és la quantitat total?', unknown: 'Per calcular',
    rows: 'Files', columns: 'Columnes', split: 'Separa les columnes després de', arrayHelp: 'Dibuixa les files i les columnes al paper. Si et va bé, separa les columnes en dues parts i calcula cada part.',
    objects: 'Objectes per repartir', groupCount: 'Nombre de grups', batch: 'Objectes per grup en cada tanda', distribute: 'Anota una tanda', reset: 'Torna a començar', group: 'Grup', groupHelp: 'Dibuixa els grups al paper. Anota cada tanda, calcula quant has repartit i comprova que no superes el total.', batchList: 'Tandes anotades per a cada grup', none: 'Encara no has anotat cap tanda.', limit: 'Has arribat al límit de tandes. Continua el repartiment al paper.',
    first: 'Primer, què vols explorar?', then: 'Després, pots provar una altra eina i anotar el pas següent al paper.', invalid: 'Introdueix un nombre enter entre −999 i 999 diferent de zero.', apply: 'Desa el canvi',
  },
  es: {
    title: 'Un espacio para pensar', intro: 'Usa estas herramientas para organizar tus ideas. Coge papel y lápiz para hacer los cálculos.', choose: 'Elige una herramienta', guide: '¿Cómo funciona esta herramienta?', selectedTool: 'Herramienta seleccionada',
    numberLine: 'Recta numérica', barModel: 'Barras', array: 'Filas y columnas', groups: 'Reparto', mixed: 'Pasos',
    chooseData: 'Escribe los datos del problema para empezar.', rangeError: 'Escribe un número entero entre {min} y {max}.', known: '¿Qué sabes?', knownTotal: 'Conozco el total', knownPart: 'Conozco una parte', partValue: 'Cantidad de cada parte', totalUnknown: 'Total por calcular',
    start: 'Punto inicial', jump: 'Salto', add: 'Añade el salto', undo: 'Deshaz el último salto', clear: 'Borra los saltos', jumpList: 'Saltos para dibujar', edit: 'Edita el salto', remove: 'Elimina el salto', noJumps: 'Todavía no hay saltos.',
    lineHelp: 'Copia la recta en el papel. Escribe el punto inicial, dibuja cada salto y calcula dónde llegas después de cada uno.', lineUnknown: 'Punto para calcular en papel',
    total: 'Cantidad total', parts: 'Partes iguales', part: 'Parte', barHelp: 'Dibuja una barra en el papel y sepárala en partes iguales. ¿Qué cantidad puedes poner en cada parte para que juntas formen el total?', partHelp: 'Dibuja las partes iguales en el papel. Si conoces la cantidad de cada parte, ¿cuál es la cantidad total?', unknown: 'Por calcular',
    rows: 'Filas', columns: 'Columnas', split: 'Separa las columnas después de', arrayHelp: 'Dibuja las filas y las columnas en el papel. Si te ayuda, separa las columnas en dos partes y calcula cada parte.',
    objects: 'Objetos para repartir', groupCount: 'Número de grupos', batch: 'Objetos por grupo en cada tanda', distribute: 'Anota una tanda', reset: 'Volver a empezar', group: 'Grupo', groupHelp: 'Dibuja los grupos en el papel. Anota cada tanda, calcula cuánto has repartido y comprueba que no superas el total.', batchList: 'Tandas anotadas para cada grupo', none: 'Todavía no has anotado ninguna tanda.', limit: 'Has llegado al límite de tandas. Continúa el reparto en papel.',
    first: 'Primero, ¿qué quieres explorar?', then: 'Después, puedes probar otra herramienta y anotar el siguiente paso en papel.', invalid: 'Introduce un número entero entre −999 y 999 distinto de cero.', apply: 'Guardar cambio',
  },
} as const;

const guides: Record<VisualLocale, Record<VisualModel, readonly string[]>> = {
  ca: {
    numberLine: [
      'Mira les dades del problema i escriu a «Punt inicial» el nombre des d’on vols començar.',
      'Escriu un salt positiu per avançar o negatiu per retrocedir i prem «Afegeix el salt». Pots afegir-ne més d’un.',
      'Copia la línia i els salts al paper. Calcula i escriu on arribes després de cada salt; els signes d’interrogació indiquen els punts que has de trobar.',
      'Si vols canviar un salt, edita’l i prem «Desa el canvi». També pots eliminar-lo, desfer l’últim o esborrar-los tots.',
    ],
    barModel: [
      'A «Què saps?», tria si coneixes el total o la quantitat de cada part igual.',
      'Escriu la quantitat que coneixes i el nombre de parts. Cada interrogant representa una quantitat que encara has de trobar.',
      'Copia la barra al paper. Si coneixes el total, busca una quantitat que, sumada tantes vegades com parts hi ha, arribi al total. També pots fer servir una multiplicació amb una casella buida.',
      'Si coneixes una part, suma-la tantes vegades com parts hi ha per trobar el total. Comprova la teva resposta.',
    ],
    array: [
      'Introdueix el nombre de files i el de columnes per representar grups iguals.',
      'Si et va bé, indica després de quina columna vols separar el rectangle en dues parts.',
      'Dibuixa les files i columnes al paper. Calcula el total o calcula les dues parts i ajunta-les.',
    ],
    groups: [
      'Escriu el nombre d’objectes i de grups iguals que vols fer.',
      'Tria quants objectes vols posar a cada grup en una tanda i prem «Anota una tanda». Repeteix-ho si cal.',
      'Copia els grups i les tandes al paper. Calcula quants objectes has repartit i comprova que no superes el total.',
      'Si vols començar una altra vegada, prem «Torna a començar».',
    ],
    mixed: [
      'Llegeix la pregunta i decideix què necessites saber primer.',
      'A «Primer, què vols explorar?», tria l’eina que t’ajudi amb aquest primer pas i segueix la guia que apareix a continuació.',
      'Fes el càlcul al paper. Després, tria la mateixa eina o una altra per explorar el pas següent i comprova que respon la pregunta.',
    ],
  },
  es: {
    numberLine: [
      'Mira los datos del problema y escribe en «Punto inicial» el número desde el que quieres empezar.',
      'Escribe un salto positivo para avanzar o negativo para retroceder y pulsa «Añade el salto». Puedes añadir más de uno.',
      'Copia la recta y los saltos en el papel. Calcula y escribe dónde llegas después de cada salto; los signos de interrogación indican los puntos que debes encontrar.',
      'Si quieres cambiar un salto, edítalo y pulsa «Guardar cambio». También puedes eliminarlo, deshacer el último o borrarlos todos.',
    ],
    barModel: [
      'En «¿Qué sabes?», elige si conoces el total o la cantidad de cada parte igual.',
      'Escribe la cantidad que conoces y el número de partes. Cada interrogante representa una cantidad que todavía tienes que encontrar.',
      'Copia la barra en el papel. Si conoces el total, busca una cantidad que, sumada tantas veces como partes hay, llegue al total. También puedes usar una multiplicación con una casilla vacía.',
      'Si conoces una parte, súmala tantas veces como partes hay para encontrar el total. Comprueba tu respuesta.',
    ],
    array: [
      'Introduce el número de filas y el de columnas para representar grupos iguales.',
      'Si te ayuda, indica después de qué columna quieres separar el rectángulo en dos partes.',
      'Dibuja las filas y columnas en el papel. Calcula el total o calcula las dos partes y júntalas.',
    ],
    groups: [
      'Escribe el número de objetos y de grupos iguales que quieres hacer.',
      'Elige cuántos objetos quieres poner en cada grupo en una tanda y pulsa «Anota una tanda». Repítelo si hace falta.',
      'Copia los grupos y las tandas en el papel. Calcula cuántos objetos has repartido y comprueba que no superas el total.',
      'Si quieres empezar otra vez, pulsa «Volver a empezar».',
    ],
    mixed: [
      'Lee la pregunta y decide qué necesitas saber primero.',
      'En «Primero, ¿qué quieres explorar?», elige la herramienta que te ayude con ese primer paso y sigue la guía que aparece a continuación.',
      'Haz el cálculo en papel. Después, elige la misma herramienta u otra para explorar el paso siguiente y comprueba que responde a la pregunta.',
    ],
  },
};

function ToolGuide({ locale, model, mixedTool }: { locale: VisualLocale; model: VisualModel; mixedTool: BaseModel }) {
  const t = copy[locale];
  return <details className="tool-guide">
    <summary>{t.guide}</summary>
    <div className="tool-guide-content">
      <h4>{t[model]}</h4>
      <ol>{guides[locale][model].map(step => <li key={step}>{step}</li>)}</ol>
      {model === 'mixed' && <><h4>{t.selectedTool}: {t[mixedTool]}</h4><ol>{guides[locale][mixedTool].map(step => <li key={step}>{step}</li>)}</ol></>}
    </div>
  </details>;
}

function numberValue(value: string, min: number, max: number): number | null {
  if (!/^-?\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

function BoundedInput({ locale, label, value, min, max, onChange, id }: {
  locale: VisualLocale; label: string; value: string; min: number; max: number;
  onChange: (value: string) => void; id?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const invalid = value !== '' && numberValue(value, min, max) === null;
  const errorId = `${inputId}-error`;
  const message = copy[locale].rangeError.replace('{min}', String(min)).replace('{max}', String(max));
  return <label htmlFor={inputId}>{label}<input id={inputId} aria-label={label} type="number" inputMode="numeric" min={min} max={max} value={value} aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} onChange={e => onChange(e.target.value)} />{invalid && <span className="input-error" id={errorId}>{message}</span>}</label>;
}

function JumpEditor({ value, index, locale, onChange, onRemove }: { value: number; index: number; locale: VisualLocale; onChange: (value: number) => void; onRemove: () => void }) {
  const t = copy[locale];
  const [draft, setDraft] = useState(String(value));
  const [invalid, setInvalid] = useState(false);
  const save = () => {
    const next = Number(draft);
    if (!draft.trim() || !Number.isInteger(next) || Math.abs(next) > 999 || next === 0) { setInvalid(true); return; }
    setInvalid(false);
    onChange(next);
  };
  return <li>
    <p>{t.jump} {index + 1}: {value > 0 ? '+' : ''}{value} → ?</p>
    <label>{t.edit} {index + 1}<input type="number" min="-999" max="999" value={draft} aria-invalid={invalid} onChange={e => setDraft(e.target.value)} /></label>
    <button type="button" onClick={save}>{t.apply}</button>{' '}
    <button type="button" onClick={onRemove}>{t.remove} {index + 1}</button>
    {invalid && <p role="alert">{t.invalid}</p>}
  </li>;
}

function NumberLine({ locale }: ModelProps) {
  const t = copy[locale];
  const id = useId();
  const [start, setStart] = useState('');
  const [jump, setJump] = useState('');
  const [jumps, setJumps] = useState<Array<{ id: number; value: number }>>([]);
  const nextJumpId = useRef(0);
  const [error, setError] = useState(false);
  const initial = numberValue(start, -999, 999);
  const jumpValue = numberValue(jump, -999, 999);
  // Coordinates represent direction and order only; no calculated endpoint is rendered.
  const points = jumps.reduce<number[]>((values, item) => [...values, values[values.length - 1] + item.value], [initial ?? 0]);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = Math.max(max - min, 1);
  const x = (n: number) => 36 + ((n - min) / span) * 328;
  const addJump = () => {
    const value = jumpValue;
    if (initial === null || value === null || value === 0) { setError(true); return; }
    setError(false);
    setJumps(old => [...old, { id: nextJumpId.current++, value }]);
  };
  return <div className="visual-tool">
    <p className="paper-prompt">✎ {t.lineHelp}</p>
    <div className="visual-controls"><BoundedInput id={`${id}-start`} locale={locale} label={t.start} value={start} min={-999} max={999} onChange={setStart} /><BoundedInput id={`${id}-jump`} locale={locale} label={t.jump} value={jump} min={-999} max={999} onChange={setJump} /><button type="button" onClick={addJump} disabled={initial === null || jumpValue === null}>{t.add}</button></div>
    {error && <p role="alert">{t.invalid}</p>}
    {initial === null ? <p>{t.chooseData}</p> : <><svg className="number-line" viewBox="0 0 400 105" aria-hidden="true" focusable="false">
      <line x1="28" y1="65" x2="372" y2="65" stroke="currentColor" strokeWidth="2" />
      {points.map((point, index) => <g key={index}>
        {index > 0 && <line x1={x(points[index - 1])} y1={30 + (index % 2) * 12} x2={x(point)} y2={30 + (index % 2) * 12} stroke="#a14b32" strokeWidth="3" markerEnd={`url(#${id}-arrow)`} />}
        <circle cx={x(point)} cy="65" r="4" fill="#a14b32" />
        <text x={x(point)} y="88" textAnchor="middle" fontSize="12" fill="currentColor">{index === 0 ? initial : '?'}</text>
      </g>)}
      <defs><marker id={`${id}-arrow`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#a14b32" /></marker></defs>
    </svg>
    <p>{t.start}: {initial}. {t.lineUnknown}: ?</p></>}
    <h4>{t.jumpList}</h4>
    {jumps.length === 0 ? <p>{t.noJumps}</p> : <ol className="jump-list">{jumps.map((item, index) => <JumpEditor key={item.id} value={item.value} index={index} locale={locale} onChange={next => setJumps(old => old.map(entry => entry.id === item.id ? { ...entry, value: next } : entry))} onRemove={() => setJumps(old => old.filter(entry => entry.id !== item.id))} />)}</ol>}
    <div className="visual-actions"><button type="button" disabled={!jumps.length} onClick={() => setJumps(old => old.slice(0, -1))}>{t.undo}</button><button type="button" disabled={!jumps.length} onClick={() => setJumps([])}>{t.clear}</button></div>
  </div>;
}

function BarModel({ locale }: ModelProps) {
  const t = copy[locale];
  const [mode, setMode] = useState<'total' | 'part'>('total');
  const [known, setKnown] = useState('');
  const [parts, setParts] = useState('');
  const amount = numberValue(known, 0, 999);
  const count = numberValue(parts, 2, 10);
  return <div className="visual-tool">
    <p className="paper-prompt">✎ {mode === 'total' ? t.barHelp : t.partHelp}</p>
    <div className="visual-controls"><label>{t.known}<select value={mode} onChange={e => { setMode(e.target.value as 'total' | 'part'); setKnown(''); }}><option value="total">{t.knownTotal}</option><option value="part">{t.knownPart}</option></select></label><BoundedInput locale={locale} label={mode === 'total' ? t.total : t.partValue} value={known} min={0} max={999} onChange={setKnown} /><BoundedInput locale={locale} label={t.parts} value={parts} min={2} max={10} onChange={setParts} /></div>
    {amount === null || count === null ? <p>{t.chooseData}</p> : <>
      <p>{mode === 'total' ? `${t.total}: ${amount}` : `${t.totalUnknown}: ?`}. {t.parts}: {count}.</p>
      <div className="bar-parts">{Array.from({ length: count }, (_, i) => <div key={i}><span>{t.part} {i + 1}</span>{mode === 'total' ? <strong aria-label={t.unknown}>?</strong> : <strong>{amount}</strong>}</div>)}</div>
      <p>{mode === 'total' ? `${count} × □ = ${amount}` : `${count} × ${amount} = ___`}</p>
    </>}
  </div>;
}

function ArrayModel({ locale }: ModelProps) {
  const t = copy[locale];
  const [rows, setRows] = useState('');
  const [columns, setColumns] = useState('');
  const [split, setSplit] = useState('');
  const r = numberValue(rows, 1, 12);
  const c = numberValue(columns, 1, 12);
  const s = numberValue(split, 0, c ?? 12);
  return <div className="visual-tool">
    <p className="paper-prompt">✎ {t.arrayHelp}</p>
    <div className="visual-controls"><BoundedInput locale={locale} label={t.rows} value={rows} min={1} max={12} onChange={setRows} /><BoundedInput locale={locale} label={t.columns} value={columns} min={1} max={12} onChange={setColumns} /><BoundedInput locale={locale} label={t.split} value={split} min={0} max={c ?? 12} onChange={setSplit} /></div>
    {r === null || c === null ? <p>{t.chooseData}</p> : <><div className="array-diagram" aria-hidden="true"><span>{r} {t.rows.toLowerCase()}</span><div className="array-rectangle">{s !== null && <i style={{ left: `${s / c * 100}%` }} />}</div><span>{c} {t.columns.toLowerCase()}</span></div>
    <p>{t.rows}: {r}. {t.columns}: {c}.{s !== null && ` ${t.split}: ${s}.`}</p>
    <p>{r} × {c} = ___</p></>}
  </div>;
}

function GroupModel({ locale }: ModelProps) {
  const t = copy[locale];
  const [total, setTotal] = useState('');
  const [groups, setGroups] = useState('');
  const [batch, setBatch] = useState('');
  const [batches, setBatches] = useState<number[]>([]);
  const [error, setError] = useState(false);
  const amount = numberValue(total, 0, 999);
  const count = numberValue(groups, 1, 12);
  const size = numberValue(batch, 1, 999);
  const add = () => {
    if (amount === null || count === null || size === null) return;
    if (batches.length >= 50) { setError(true); return; }
    setError(false);
    setBatches(old => [...old, size]);
  };
  const reset = () => { setBatches([]); setError(false); };
  return <div className="visual-tool">
    <p className="paper-prompt">✎ {t.groupHelp}</p>
    <div className="visual-controls"><BoundedInput locale={locale} label={t.objects} value={total} min={0} max={999} onChange={value => { setTotal(value); reset(); }} /><BoundedInput locale={locale} label={t.groupCount} value={groups} min={1} max={12} onChange={value => { setGroups(value); reset(); }} /><BoundedInput locale={locale} label={t.batch} value={batch} min={1} max={999} onChange={setBatch} /></div>
    <div className="visual-actions"><button type="button" onClick={add} disabled={amount === null || count === null || size === null}>{t.distribute}</button><button type="button" onClick={reset}>{t.reset}</button></div>
    {error && <p role="alert">{t.limit}</p>}
    {amount === null || count === null ? <p>{t.chooseData}</p> : <><div className="group-list" aria-hidden="true">{Array.from({ length: count }, (_, i) => <div key={i}><span>{t.group} {i + 1}</span><strong>?</strong></div>)}</div>
    <p>{t.objects}: {amount}. {t.groupCount}: {count}. {t.batchList}: {batches.length ? batches.map(value => `+${value}`).join(', ') : t.none}</p></>}
  </div>;
}

function Tool({ model, locale }: ModelProps & { model: BaseModel }) {
  switch (model) {
    case 'numberLine': return <NumberLine locale={locale} />;
    case 'barModel': return <BarModel locale={locale} />;
    case 'array': return <ArrayModel locale={locale} />;
    case 'groups': return <GroupModel locale={locale} />;
  }
}

export function VisualLab({ locale, suggestedModel }: Props) {
  const t = copy[locale];
  const [model, setModel] = useState<VisualModel>(suggestedModel);
  const [mixedTool, setMixedTool] = useState<BaseModel>('numberLine');
  return <section className="visual-lab" aria-label={t.title}>
    <div className="visual-lab-heading"><div><h3>{t.title}</h3><p>{t.intro}</p></div><label>{t.choose}<select value={model} onChange={e => setModel(e.target.value as VisualModel)}>{([...baseModels, 'mixed'] as VisualModel[]).map(key => <option key={key} value={key}>{t[key]}</option>)}</select></label></div>
    <ToolGuide locale={locale} model={model} mixedTool={mixedTool} />
    {model === 'mixed' && <div className="visual-tool"><label>{t.first}<select value={mixedTool} onChange={e => setMixedTool(e.target.value as BaseModel)}>{baseModels.map(key => <option key={key} value={key}>{t[key]}</option>)}</select></label><p>{t.then}</p></div>}
    {baseModels.map(tool => <div key={tool} hidden={tool !== (model === 'mixed' ? mixedTool : model)}><Tool model={tool} locale={locale} /></div>)}
  </section>;
}
