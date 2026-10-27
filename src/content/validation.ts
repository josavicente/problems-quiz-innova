import type { Locale, Problem, VisualModel } from './problems';

const locales: Locale[] = ['ca', 'es'];
const visualModels: VisualModel[] = ['numberLine', 'barModel', 'array', 'groups', 'mixed'];

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function localized(value: unknown): boolean {
  return record(value) && locales.every(locale => typeof value[locale] === 'string' && value[locale].trim().length > 0);
}

/** Interpret only the catalogue's two-operand integer operations, never JS. */
export function calculateContentStep(expression: string): number | null {
  const match = /^\s*(\d+)\s*([+\-*/])\s*(\d+)\s*$/.exec(expression);
  if (!match) return null;
  const left = Number(match[1]);
  const right = Number(match[3]);
  if (!Number.isSafeInteger(left) || !Number.isSafeInteger(right)) return null;
  let result: number;
  switch (match[2]) {
    case '+': result = left + right; break;
    case '-': result = left - right; break;
    case '*': result = left * right; break;
    case '/':
      if (right === 0 || left % right !== 0) return null;
      result = left / right;
      break;
    default: return null;
  }
  return Number.isSafeInteger(result) && result >= 0 ? result : null;
}

/** Validate untrusted input before it becomes the application's problem bank. */
export function validateProblems(value: unknown): string[] {
  if (!Array.isArray(value)) return ['El catálogo debe ser una lista.'];
  const errors: string[] = [];
  if (value.length !== 60) errors.push('El catálogo debe contener 60 problemas.');
  const ids = new Set<string>();
  const titles = { ca: new Set<string>(), es: new Set<string>() };
  value.forEach((item: unknown, index) => {
    if (!record(item)) { errors.push(`Problema ${index + 1}: formato inválido.`); return; }
    const id = typeof item.id === 'string' ? item.id : '';
    const label = id || `Problema ${index + 1}`;
    const idMatch = /^L([1-5])-(0[1-9]|1[0-2])$/.exec(id);
    if (!idMatch || Number(idMatch[1]) !== item.level) errors.push(`${label}: identificador o nivel inválido.`);
    if (ids.has(id)) errors.push(`${label}: identificador duplicado.`);
    ids.add(id);
    for (const field of ['title', 'statement', 'question', 'workedSolution'] as const) {
      if (!localized(item[field])) errors.push(`${label}: ${field} requiere textos en catalán y castellano.`);
    }
    if (localized(item.title) && record(item.title)) {
      for (const locale of locales) {
        const title = (item.title[locale] as string).trim().toLocaleLowerCase(locale);
        if (titles[locale].has(title)) errors.push(`${label}: título duplicado (${locale}).`);
        titles[locale].add(title);
      }
    }
    if (!record(item.answer) || !Number.isSafeInteger(item.answer.value) || (item.answer.value as number) < 0 || !localized(item.answer.unit)) errors.push(`${label}: respuesta o unidad inválida.`);
    if (!Array.isArray(item.hints) || item.hints.length !== 3 || !item.hints.every(localized)) errors.push(`${label}: se requieren tres pistas bilingües.`);
    if (typeof item.visualModel !== 'string' || !visualModels.includes(item.visualModel as VisualModel)) errors.push(`${label}: modelo visual inválido.`);
    if (!Array.isArray(item.steps) || item.steps.length === 0) { errors.push(`${label}: faltan los pasos.`); return; }
    item.steps.forEach((step: unknown, stepIndex: number) => {
      if (!record(step) || typeof step.expression !== 'string' || !Number.isSafeInteger(step.result) || calculateContentStep(step.expression) !== step.result) errors.push(`${label}: operación ${stepIndex + 1} inválida.`);
    });
    const last = item.steps[item.steps.length - 1];
    if (!record(last) || !record(item.answer) || last.result !== item.answer.value) errors.push(`${label}: último paso distinto de la respuesta.`);
  });
  for (let level = 1; level <= 5; level += 1) {
    for (let index = 1; index <= 12; index += 1) {
      const id = `L${level}-${String(index).padStart(2, '0')}`;
      if (!ids.has(id)) errors.push(`Falta el problema ${id}.`);
    }
  }
  return errors;
}

export function assertValidProblems(value: unknown): asserts value is Problem[] {
  const errors = validateProblems(value);
  if (errors.length) throw new Error(`Catálogo de problemas inválido:\n${errors.join('\n')}`);
}
