import { describe, expect, it } from 'vitest';
import { problems } from '../content/problems';

// The content supports only a binary arithmetic operation per step. Do not
// execute expressions as code: malformed or unsupported expressions fail.
function calculate(expression: string): number {
  const match = /^\s*(\d+)\s*([+\-*/])\s*(\d+)\s*$/.exec(expression);
  if (!match) throw new Error(`Unsupported expression: ${expression}`);
  const left = Number(match[1]);
  const right = Number(match[3]);
  switch (match[2]) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/':
      if (right === 0 || left % right !== 0) throw new Error(`Non-exact division: ${expression}`);
      return left / right;
    default: throw new Error(`Unsupported operator in ${expression}`);
  }
}

describe('problem catalogue', () => {
  it('has twelve uniquely identified problems in each of five levels', () => {
    expect(problems).toHaveLength(60);
    expect(new Set(problems.map((problem) => problem.id)).size).toBe(60);
    for (let level = 1; level <= 5; level += 1) {
      const ids = problems.filter((problem) => problem.level === level).map((problem) => problem.id);
      expect(ids).toHaveLength(12);
      expect(ids).toEqual(Array.from({ length: 12 }, (_, index) => `L${level}-${String(index + 1).padStart(2, '0')}`));
    }
  });

  it('provides complete Catalan and Spanish content for every exercise', () => {
    for (const problem of problems) {
      expect(problem.hints, problem.id).toHaveLength(3);
      for (const locale of ['ca', 'es'] as const) {
        const localized = [problem.title, problem.statement, problem.question, problem.answer.unit, ...problem.hints, problem.workedSolution];
        for (const text of localized) expect(text[locale].trim(), `${problem.id} ${locale}`).not.toBe('');
      }
      expect(['numberLine', 'barModel', 'array', 'groups', 'mixed']).toContain(problem.visualModel);
      expect(Number.isSafeInteger(problem.answer.value), problem.id).toBe(true);
      expect(problem.answer.value, problem.id).toBeGreaterThanOrEqual(0);
    }
  });

  it('has mathematically correct steps ending in the recorded answer', () => {
    for (const problem of problems) {
      expect(problem.steps.length, problem.id).toBeGreaterThan(0);
      for (const step of problem.steps) expect(calculate(step.expression), `${problem.id}: ${step.expression}`).toBe(step.result);
      expect(problem.steps[problem.steps.length - 1].result, problem.id).toBe(problem.answer.value);
    }
  });

  it('guides paper calculations without providing new calculated numbers in hints', () => {
    for (const problem of problems) {
      for (const locale of ['ca', 'es'] as const) {
        const sourceNumbers = new Set((`${problem.statement[locale]} ${problem.question[locale]}`.match(/\d+/g) ?? []).map(Number));
        if (/\b(doble|meitat|mitad|dues|dos)\b/i.test(`${problem.statement[locale]} ${problem.question[locale]}`)) sourceNumbers.add(2);
        const hints = problem.hints.map((hint) => hint[locale]);
        for (const hint of hints) {
          for (const number of (hint.match(/\d+/g) ?? []).map(Number)) {
            expect(sourceNumbers.has(number), `${problem.id} ${locale}: ${hint}`).toBe(true);
          }
          expect(hint, `${problem.id} ${locale}`).not.toMatch(/[÷/]/);
        }
        if (problem.steps[0].expression.includes('/')) {
          expect(hints[2], `${problem.id} ${locale}`).toMatch(/□ × (?:\d+|□) = (?:\d+|□)/);
        } else {
          expect(hints[2], `${problem.id} ${locale}`).toContain('= □');
        }
        expect(hints[2].match(/=/g), `${problem.id} ${locale}`).toHaveLength(1);
      }
    }
  });

  it('presents sharing with inverse multiplication rather than division notation', () => {
    for (const problem of problems) {
      for (const locale of ['ca', 'es'] as const) {
        expect(problem.workedSolution[locale], `${problem.id} ${locale}`).not.toMatch(/[÷/]/);
        expect(problem.hints.map(hint => hint[locale]).join(' '), `${problem.id} ${locale}`).not.toMatch(/[÷/]/);
      }
      for (const step of problem.steps) {
        const share = /^(\d+)\s*\/\s*(\d+)$/.exec(step.expression);
        if (share && problem.level >= 3 && Number(problem.id.slice(3)) >= 7) {
          expect(problem.workedSolution.ca).toContain(`${share[2]} × ${step.result} = ${share[1]}`);
          expect(problem.workedSolution.es).toContain(`${share[2]} × ${step.result} = ${share[1]}`);
        }
      }
    }
    const halves = problems.find(problem => problem.id === 'L2-01')!;
    expect(halves.hints[2].ca).toContain('□ × 2 = 84');
    expect(halves.hints[2].es).toContain('□ × 2 = 84');
  });
});
