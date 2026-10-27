import { expect, test, webkit } from '@playwright/test';

const sizes = [
  { name: 'iPad vertical 768', width: 768, height: 1024 },
  { name: 'iPad vertical 820', width: 820, height: 1180 },
  { name: 'iPad horizontal', width: 1024, height: 768 },
];

for (const size of sizes) {
  test(`${size.name}: practice is usable by touch without horizontal overflow`, async ({ baseURL }) => {
    // Use WebKit and touch emulation, rather than assuming Chromium matches iPadOS Safari.
    const browser = await webkit.launch();
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      screen: { width: size.width, height: size.height },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const noOverflow = async () => {
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    };
    try {
      await page.goto(baseURL!);
      await expect(page.getByRole('heading', { name: 'Tria el teu camí' })).toBeVisible();
      await noOverflow();
      const language = page.getByRole('button', { name: 'CAS' });
      const languageBounds = await language.boundingBox();
      expect(languageBounds!.height).toBeGreaterThanOrEqual(44);
      await page.getByRole('button', { name: /^Comença/ }).first().tap();
      await expect(page.getByRole('heading', { name: 'Els adhesius' })).toBeVisible();
      const illustration = page.getByRole('img', { name: /àlbum obert i adhesius/ });
      await expect(illustration).toBeVisible();
      await expect.poll(() => illustration.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      await noOverflow();

      const lab = page.getByRole('region', { name: 'Un espai per pensar' });
      const labWidth = await lab.evaluate(el => el.getBoundingClientRect().width);
      expect(labWidth).toBeGreaterThanOrEqual(300);
      const guide = lab.getByText('Com funciona aquesta eina?', { exact: true });
      const guideBounds = await guide.boundingBox();
      expect(guideBounds!.height).toBeGreaterThanOrEqual(44);
      await guide.tap();
      await expect(lab.getByText(/Copia la línia i els salts al paper/)).toBeVisible();
      const start = lab.getByLabel('Punt inicial', { exact: true });
      expect(await start.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
      await start.fill('26');
      await lab.getByLabel('Salt', { exact: true }).fill('10');
      await lab.getByRole('button', { name: 'Afegeix el salt' }).tap();
      await expect(lab.getByText('Salt 1: +10 → ?')).toBeVisible();
      await noOverflow();

      await lab.getByLabel('Tria una eina').selectOption('groups');
      await lab.getByLabel('Objectes per repartir').fill('12');
      await lab.getByLabel('Nombre de grups').fill('3');
      await lab.getByLabel('Objectes per grup en cada tanda').fill('2');
      await lab.getByRole('button', { name: 'Anota una tanda' }).tap();
      await expect(lab.getByText('Tandes anotades per a cada grup: +2', { exact: false })).toBeVisible();
      const problemButton = page.getByRole('button', { name: 'Problema 2: Per descobrir' });
      const buttonBounds = await problemButton.boundingBox();
      expect(buttonBounds!.width).toBeGreaterThanOrEqual(44);
      expect(buttonBounds!.height).toBeGreaterThanOrEqual(44);
      await noOverflow();

      await page.getByLabel('La teva resposta').fill('43');
      await page.getByRole('button', { name: /Comprova/ }).tap();
      await expect(page.getByText('Molt bé! Com ho has pensat?')).toBeVisible();
      await language.tap();
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
      await expect(page.getByRole('heading', { name: 'Las pegatinas' })).toBeVisible();
      await noOverflow();
      expect(errors).toEqual([]);
    } finally {
      await context.close();
      await browser.close();
    }
  });
}
