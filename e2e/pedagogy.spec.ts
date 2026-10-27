import { expect, test } from '@playwright/test';

test('the bar model supports known totals and known parts without calculating them', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Comença/ }).first().click();
  const lab = page.getByRole('region', { name: 'Un espai per pensar' });
  await expect(lab.getByLabel('Punt inicial', { exact: true })).toHaveValue('');
  await expect(lab.getByLabel('Salt', { exact: true })).toHaveValue('');
  await expect(lab.locator('p:visible').filter({ hasText: 'Escriu les dades del problema per començar.' })).toBeVisible();

  await lab.getByLabel('Tria una eina').selectOption('barModel');
  await expect(lab.getByLabel('Quantitat total')).toHaveValue('');
  await expect(lab.getByLabel('Parts iguals')).toHaveValue('');
  await lab.getByLabel('Quantitat total').fill('84');
  await lab.getByLabel('Parts iguals').fill('2');
  await expect(lab.getByText('2 × □ = 84')).toBeVisible();
  await expect(lab.getByText('42', { exact: true })).toHaveCount(0);

  await lab.getByLabel('Què saps?').selectOption('part');
  await expect(lab.getByLabel('Quantitat de cada part')).toHaveValue('');
  await lab.getByLabel('Quantitat de cada part').fill('29');
  await expect(lab.getByText('2 × 29 = ___')).toBeVisible();
  await expect(lab.getByText('Total per calcular: ?', { exact: false })).toBeVisible();
  await expect(lab.getByText('58', { exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'CAS' }).click();
  const esLab = page.getByRole('region', { name: 'Un espacio para pensar' });
  await expect(esLab.getByLabel('¿Qué sabes?')).toHaveValue('part');
  await expect(esLab.getByText('Total por calcular: ?', { exact: false })).toBeVisible();
  await expect(esLab.getByText('2 × 29 = ___')).toBeVisible();
});

test('invalid visual-model inputs never silently change the represented numbers', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Comença/ }).first().click();
  const lab = page.getByRole('region', { name: 'Un espai per pensar' });
  await lab.getByLabel('Tria una eina').selectOption('array');
  await lab.getByLabel('Files', { exact: true }).fill('6');
  await lab.getByLabel('Columnes', { exact: true }).fill('13');
  await expect(lab.getByLabel('Columnes', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(lab.getByText('Escriu un nombre enter entre 1 i 12.')).toBeVisible();
  await expect(lab.getByText('6 × 12 = ___')).toHaveCount(0);
  await lab.getByLabel('Columnes', { exact: true }).fill('8');
  await expect(lab.getByText('6 × 8 = ___')).toBeVisible();
  await lab.getByLabel('Separa les columnes després de').fill('9');
  await expect(lab.getByLabel('Separa les columnes després de')).toHaveAttribute('aria-invalid', 'true');
  await expect(lab.getByText('Escriu un nombre enter entre 0 i 8.')).toBeVisible();

  await lab.getByLabel('Tria una eina').selectOption('groups');
  await expect(lab.getByRole('button', { name: 'Anota una tanda' })).toBeDisabled();
  await lab.getByLabel('Objectes per repartir').fill('1000');
  await expect(lab.getByLabel('Objectes per repartir')).toHaveAttribute('aria-invalid', 'true');
  await expect(lab.getByText('Objectes per repartir: 999', { exact: false })).toHaveCount(0);
});
