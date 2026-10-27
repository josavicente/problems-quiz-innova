import { expect, test } from '@playwright/test';

test('practice, hints, language and progress survive a reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await expect(page.getByRole('heading', { name: 'Tria el teu camí' })).toBeVisible();
  await page.getByRole('button', { name: /^Comença/ }).first().click();
  await expect(page.getByRole('heading', { name: 'Els adhesius' })).toBeVisible();

  const answer = page.getByLabel('La teva resposta');
  await answer.fill('42');
  await page.getByRole('button', { name: /Comprova/ }).click();
  await expect(page.getByText('Encara no. Revisa les dades i torna-ho a provar.')).toBeVisible();
  await expect(page.getByRole('button', { name: /Veure una possible solució/ })).toHaveCount(0);
  await page.getByRole('button', { name: /Necessito una pista/ }).click();
  await expect(page.getByText('Comença amb els 26 adhesius que ja té.')).toBeVisible();
  await page.getByRole('button', { name: /Necessito una pista/ }).click();
  await page.getByRole('button', { name: /Necessito una pista/ }).click();
  await expect(page.getByText(/26 \+ 17 = □/)).toBeVisible();
  await expect(page.getByText(/26 → 36 → 43/)).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Veure una possible solució/ })).toBeVisible();
  await expect(page.getByText(/En total té 43 adhesius/)).toHaveCount(0);
  await answer.fill('43');
  await page.getByRole('button', { name: /Comprova/ }).click();
  await expect(page.getByText('Molt bé! Com ho has pensat?')).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('math-practice:v2') ?? '{}').entries?.['L1-01']?.history)).toMatchObject([
    { answerInput: '42', correct: false }, { answerInput: '43', correct: true },
  ]);

  await page.getByRole('button', { name: 'CAS' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Las pegatinas' })).toBeVisible();
  await expect(page.getByText('Empieza con las 26 pegatinas que ya tiene.')).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByText('1/12 resueltos')).toBeVisible();
  await page.getByRole('button', { name: /^Continúa/ }).first().click();
  await expect(page.getByRole('heading', { name: 'Las pegatinas' })).toBeVisible();
  await expect(page.getByText('Empieza con las 26 pegatinas que ya tiene.')).toBeVisible();
});

test('a level summary and reset confirmation work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Comença/ }).first().click();
  await page.getByLabel('La teva resposta').fill('43');
  await page.getByRole('button', { name: /Comprova/ }).click();
  await page.getByRole('button', { name: 'Problema 12: Per descobrir' }).click();
  await page.getByRole('button', { name: /Veure el resum/ }).click();
  await expect(page.getByRole('heading', { name: 'Mira tot el que has practicat!' })).toBeVisible();
  await page.getByRole('button', { name: 'Tots els nivells' }).click();
  await page.getByRole('button', { name: 'Reinicia el progrés' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Cancel·la' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('1/12 resolts')).toBeVisible();
  await page.getByRole('button', { name: 'Reinicia el progrés' }).click();
  await dialog.getByRole('button', { name: 'Sí, reinicia' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('0/12 resolts')).toHaveCount(5);
  await page.reload();
  await expect(page.getByText('0/12 resolts')).toHaveCount(5);
});

test('migrates version 1 attempts and safely recovers corrupt data', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.removeItem('math-practice:v2');
    localStorage.setItem('math-practice:v1', JSON.stringify({
      schemaVersion: 1, currentProblemId: 'L1-01', completedProblemIds: ['L1-01'],
      attempts: [{ problemId: 'L1-01', answerInput: '43', correct: true, hintsUsed: 1, createdAt: '2026-10-27T10:00:00.000Z' }],
    }));
  });
  await page.reload();
  await expect(page.getByText('1/12 resolts')).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('math-practice:v2') ?? '{}').entries?.['L1-01']?.history)).toMatchObject([{ answerInput: '43', correct: true }]);
  await page.evaluate(() => localStorage.setItem('math-practice:v2', '{invalid json'));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Tria el teu camí' })).toBeVisible();
  await expect(page.getByText('0/12 resolts')).toHaveCount(5);
});

test('visual tools guide work on paper without calculating the answers', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Comença/ }).first().click();
  const lab = page.getByRole('region', { name: 'Un espai per pensar' });
  await lab.getByLabel('Punt inicial', { exact: true }).fill('26');
  await lab.getByLabel('Salt', { exact: true }).fill('10');
  await lab.getByRole('button', { name: 'Afegeix el salt' }).click();
  await expect(lab.getByText('Salt 1: +10 → ?')).toBeVisible();
  await expect(lab.getByText('36', { exact: true })).toHaveCount(0);
  await lab.getByLabel('Salt', { exact: true }).fill('-5');
  await lab.getByRole('button', { name: 'Afegeix el salt' }).click();
  await expect(lab.getByText('Salt 2: -5 → ?')).toBeVisible();
  await expect(lab.getByText('31', { exact: true })).toHaveCount(0);
  await lab.getByRole('button', { name: 'Desfés l’últim salt' }).click();
  await expect(lab.getByText('Salt 2: -5 → ?')).toHaveCount(0);

  await lab.getByLabel('Tria una eina').selectOption('barModel');
  await lab.getByLabel('Quantitat total').fill('84');
  await lab.getByLabel('Parts iguals').fill('2');
  await expect(lab.getByText('2 × □ = 84')).toBeVisible();
  await expect(lab).not.toContainText('÷');
  await expect(lab.getByText('42', { exact: true })).toHaveCount(0);

  await lab.getByLabel('Tria una eina').selectOption('array');
  await lab.getByLabel('Files', { exact: true }).fill('6');
  await lab.getByLabel('Columnes', { exact: true }).fill('8');
  await expect(lab.getByText('6 × 8 = ___')).toBeVisible();
  await expect(lab.getByText('48', { exact: true })).toHaveCount(0);

  await lab.getByLabel('Tria una eina').selectOption('groups');
  await lab.getByLabel('Objectes per repartir').fill('12');
  await lab.getByLabel('Nombre de grups').fill('3');
  await lab.getByLabel('Objectes per grup en cada tanda').fill('2');
  await lab.getByRole('button', { name: 'Anota una tanda' }).click();
  await expect(lab.getByText('Tandes anotades per a cada grup: +2', { exact: false })).toBeVisible();
  await expect(lab.getByText('Per repartir: 6.', { exact: false })).toHaveCount(0);
  await lab.getByLabel('Tria una eina').selectOption('numberLine');
  await expect(lab.getByText('Salt 1: +10 → ?')).toBeVisible();
  await lab.getByLabel('Tria una eina').selectOption('groups');
  await expect(lab.getByText('Tandes anotades per a cada grup: +2', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'CAS' }).click();
  const spanishLab = page.getByRole('region', { name: 'Un espacio para pensar' });
  await expect(spanishLab.getByText(/Dibuja los grupos en el papel/)).toBeVisible();
  await expect(spanishLab.getByText(/Por repartir: 6/)).toHaveCount(0);
});

test('each tool offers a contextual, keyboard-accessible guide in both languages', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Comença/ }).first().click();
  const lab = page.getByRole('region', { name: 'Un espai per pensar' });
  const chooser = lab.getByLabel('Tria una eina');

  for (const [model, heading] of Object.entries({ numberLine: 'Línia numèrica', barModel: 'Barres', array: 'Files i columnes', groups: 'Repartiment', mixed: 'Passos' })) {
    await chooser.selectOption(model);
    const guide = lab.locator('details').filter({ hasText: 'Com funciona aquesta eina?' });
    const summary = guide.locator('summary');
    await expect(summary).toBeVisible();
    await expect(guide).not.toHaveAttribute('open', '');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(guide).toHaveAttribute('open', '');
    await expect(guide.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    await expect(guide.locator('ol > li').first()).toBeVisible();
    await expect(guide.locator('ol > li').nth(1)).toBeVisible();
    await expect(guide.getByText(/26 → 36 → 43/)).toHaveCount(0);
    if (model === 'mixed') {
      await expect(guide.getByRole('heading', { name: 'Eina seleccionada: Línia numèrica' })).toBeVisible();
      await lab.getByLabel('Primer, què vols explorar?').selectOption('groups');
      await expect(guide.getByRole('heading', { name: 'Eina seleccionada: Repartiment' })).toBeVisible();
      await summary.focus();
    }
    await page.keyboard.press('Enter');
    await expect(guide).not.toHaveAttribute('open', '');
  }

  await page.getByRole('button', { name: 'CAS' }).click();
  const spanishLab = page.getByRole('region', { name: 'Un espacio para pensar' });
  const spanishChooser = spanishLab.getByLabel('Elige una herramienta');
  for (const [model, heading] of Object.entries({ numberLine: 'Recta numérica', barModel: 'Barras', array: 'Filas y columnas', groups: 'Reparto', mixed: 'Pasos' })) {
    await spanishChooser.selectOption(model);
    const guide = spanishLab.locator('details').filter({ hasText: '¿Cómo funciona esta herramienta?' });
    await guide.locator('summary').click();
    await expect(guide.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    await expect(guide.locator('ol > li').first()).toBeVisible();
    await expect(guide.locator('ol > li').nth(1)).toBeVisible();
    await expect(guide.getByText(/26 → 36 → 43/)).toHaveCount(0);
    await guide.locator('summary').click();
  }
});
