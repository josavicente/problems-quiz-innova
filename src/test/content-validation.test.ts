import { describe, expect, it } from 'vitest';
import { problems } from '../content/problems';
import { calculateContentStep, validateProblems } from '../content/validation';

describe('runtime catalogue validation', () => {
  it('accepts the actual bilingual catalogue', () => {
    expect(validateProblems(problems)).toEqual([]);
  });

  it('detects missing exercises, duplicated ids, and a mismatched level', () => {
    const changed = structuredClone(problems);
    changed[0].id = changed[1].id;
    changed[2].level = 5;
    expect(validateProblems(changed)).toEqual(expect.arrayContaining([
      expect.stringContaining('identificador duplicado'),
      expect.stringContaining('identificador o nivel inválido'),
      'Falta el problema L1-01.',
    ]));
    expect(validateProblems(changed.slice(1))).toContain('El catálogo debe contener 60 problemas.');
  });

  it('rejects incomplete translations, hints, models and wrong results', () => {
    const changed = structuredClone(problems);
    changed[0].question.es = ' ';
    changed[0].hints[0].ca = '';
    changed[0].visualModel = 'other' as typeof changed[0]['visualModel'];
    changed[0].steps[0].result = 1;
    const errors = validateProblems(changed).join('\n');
    expect(errors).toContain('question requiere');
    expect(errors).toContain('tres pistas bilingües');
    expect(errors).toContain('modelo visual inválido');
    expect(errors).toContain('operación 1 inválida');
    expect(errors).toContain('último paso distinto');
  });

  it('parses only safe exact arithmetic and never executes expressions', () => {
    expect(calculateContentStep(' 84 / 2 ')).toBe(42);
    expect(calculateContentStep('2 * 3')).toBe(6);
    for (const expression of ['1 / 0', '3 / 2', '1 - 2', '1 + 2; alert(1)', 'Math.sqrt(4)', '1e3 + 1']) {
      expect(calculateContentStep(expression)).toBeNull();
    }
    expect(validateProblems(null)).toEqual(['El catálogo debe ser una lista.']);
  });
});
