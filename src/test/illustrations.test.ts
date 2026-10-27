import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { illustrationFor, illustrations, problemsNeedingIllustrations } from '../content/illustrations';
import { problems } from '../content/problems';

describe('illustration manifest', () => {
  it('explicitly accounts for every problem and only existing assets', () => {
    expect(Object.keys(illustrations).sort()).toEqual(problems.map(problem => problem.id).sort());
    for (const [id, scene] of Object.entries(illustrations)) {
      if (!scene) continue;
      expect(scene.src.startsWith('/illustrations/'), id).toBe(true);
      expect(existsSync(join(process.cwd(), 'public', scene.src)), id).toBe(true);
      expect(scene.alt.ca.trim(), id).not.toBe('');
      expect(scene.alt.es.trim(), id).not.toBe('');
    }
  });

  it('gives every problem a contextual scene and no unknown fallback', () => {
    expect(problemsNeedingIllustrations).toEqual([]);
    expect(illustrationFor('L3-12', 'ca')?.src).toBe('/illustrations/collection.jpg');
    expect(illustrationFor('L3-01', 'ca')?.src).toBe('/illustrations/rain.jpg');
    expect(illustrationFor('unknown', 'es')).toBeNull();
    expect(illustrationFor('L2-01', 'es')?.alt).toBe('Un puesto de fruta en un mercado.');
  });
});
