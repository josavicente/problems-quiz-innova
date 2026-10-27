import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home, practice, visual tools and reset dialog have no detectable WCAG violations', async ({ page }) => {
  await page.goto('/');
  const check = async () => {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
  };
  await check();
  await page.getByRole('button', { name: /^Comença/ }).first().click();
  await check();
  const lab = page.getByRole('region', { name: 'Un espai per pensar' });
  for (const model of ['numberLine', 'barModel', 'array', 'groups', 'mixed']) {
    await lab.getByLabel('Tria una eina').selectOption(model);
    await check();
  }
  await page.getByRole('button', { name: /Torna als nivells/ }).click();
  await page.getByRole('button', { name: 'Espai d’acompanyament' }).click();
  await check();
  await page.getByRole('button', { name: /Torna als nivells/ }).click();
  await page.getByRole('button', { name: 'Reinicia el progrés' }).click();
  await check();
});
