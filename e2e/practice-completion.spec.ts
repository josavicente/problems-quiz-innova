import { expect, test } from '@playwright/test';

test('home shows the current release notes in both languages', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Novetats', { exact: true }).click();
  await expect(page.getByText(/Primera versió: 60 problemes/)).toBeVisible();
  await page.getByRole('button', { name: 'CAS' }).click();
  await expect(page.getByText('Novedades', { exact: true })).toBeVisible();
  await expect(page.getByText(/Primera versión: 60 problemas/)).toBeVisible();
});

test('drafts and position survive reload, facts highlight data and review prioritizes unfinished problems', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Comença/ }).first().click();
  await page.getByRole('button', { name: /Què sabem/ }).click();
  await expect(page.locator('.statement mark')).toHaveText(['26', '17']);
  await expect(page.getByRole('heading', { name: 'Quants adhesius té ara?' })).toHaveClass(/question-highlight/);
  await page.getByLabel('La teva resposta').fill('4');
  await page.reload();
  await page.getByRole('button', { name: /^Continua/ }).first().click();
  await expect(page.getByLabel('La teva resposta')).toHaveValue('4');
  await page.getByLabel('La teva resposta').fill('43');
  await page.getByRole('button', { name: /Comprova/ }).click();
  await page.getByRole('button', { name: 'Problema 12: Per descobrir' }).click();
  await page.getByRole('button', { name: /Veure el resum/ }).click();
  await expect(page.getByRole('heading', { name: 'Problemes per revisar' })).toBeVisible();
  await page.getByRole('button', { name: 'Torna a practicar' }).click();
  await expect(page.getByRole('heading', { name: 'Les bales' })).toBeVisible();
});

test('reset dialog traps and restores keyboard focus', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Reinicia el progrés' });
  await trigger.focus();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  const cancel = dialog.getByRole('button', { name: 'Cancel·la' });
  const confirm = dialog.getByRole('button', { name: 'Sí, reinicia' });
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(confirm).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('adult panel reflects local practice in both languages and opens a review problem', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Comença/ }).first().click();
  await page.getByLabel('La teva resposta').fill('42');
  await page.getByRole('button', { name: /Comprova/ }).click();
  await page.getByRole('button', { name: /Necessito una pista/ }).click();
  await page.getByRole('button', { name: /Torna als nivells/ }).click();
  await page.getByRole('button', { name: 'Espai d’acompanyament' }).click();
  await expect(page.getByRole('heading', { name: 'Acompanyar el progrés' })).toBeVisible();
  await expect(page.getByText(/no un diagnòstic/)).toBeVisible();
  await page.getByRole('button', { name: 'CAS' }).click();
  await expect(page.getByRole('heading', { name: 'Acompañar el progreso' })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir el problema: Las pegatinas' }).click();
  await expect(page.getByRole('heading', { name: 'Las pegatinas' })).toBeVisible();
});
