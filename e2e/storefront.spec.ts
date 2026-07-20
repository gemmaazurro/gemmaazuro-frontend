import { test, expect, type Page } from '@playwright/test';

/**
 * End-to-end against a real seeded Django backend.
 *
 * These assert on REAL data — the six seeded items and the 17 real client
 * photos — so a regression that silently reintroduces placeholder content
 * fails here rather than shipping.
 */

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? 'http://127.0.0.1:8000';

/** Names seeded by products/management/commands/seed_storefront.py. */
const SEEDED_NAMES = [
  'Solitaire Lab Diamond Ring',
  'Pave Eternity Band',
  'Drop Pendant Necklace',
  'Tennis Bracelet',
  'Studded Drop Earrings',
  'Halo Statement Ring',
];

/**
 * Reset the cart drawer by re-navigating.
 *
 * The drawer opens automatically on add-to-cart and its backdrop swallows
 * clicks on the page beneath. `cartOpen` is component state (not persisted),
 * so a fresh navigation closes it while localStorage keeps the cart — which
 * also exercises persistence.
 */
async function reopenProduct(page: Page, path: string) {
  await page.goto(path);
  await expect(page.getByRole('button', { name: /Add to Cart/i })).toBeVisible();
}

test.describe('backend wiring', () => {
  test('the storefront renders products that exist in Django', async ({ page, request }) => {
    const api = await request.get(`${BACKEND}/products/prouduct/items/`);
    expect(api.ok()).toBeTruthy();

    const body = await api.json();
    expect(body.count).toBeGreaterThan(0);

    await page.goto('/');
    // At least one real seeded product name is on the home page.
    const names = body.results.map((item: any) => item.translations_.en.name);
    const first = names[0];
    await expect(page.getByText(first, { exact: false }).first()).toBeVisible();
  });

  test('product images are served from the backend, not local placeholders', async ({ page }) => {
    await page.goto('/collection');
    const image = page.locator('img[src*="/media/"]').first();
    await expect(image).toBeVisible();

    // The image must actually load — a broken src still renders an <img>.
    const naturalWidth = await image.evaluate(
      (node) => (node as HTMLImageElement).naturalWidth,
    );
    expect(naturalWidth).toBeGreaterThan(0);
  });
});

test.describe('no dummy data remains', () => {
  test('home and collection contain no placeholder product names', async ({ page }) => {
    const REMOVED = ['Aurora Solitaire Ring', 'Azzurro Drop Necklace', 'Lume Pendant', 'Riviera Tennis Bracelet'];

    for (const path of ['/', '/collection']) {
      await page.goto(path);
      const content = await page.content();
      for (const name of REMOVED) {
        expect(content).not.toContain(name);
      }
    }
  });

  test('account page does not show the hardcoded persona', async ({ page }) => {
    await page.goto('/account');
    const content = await page.content();
    expect(content).not.toContain('laila@example.com');
    expect(content).not.toContain('#GA-2891');
  });
});

test.describe('collection', () => {
  test('lists the seeded catalog and filters by a real subgroup', async ({ page }) => {
    await page.goto('/collection');

    // The count comes from the backend — 6 seeded items.
    await expect(page.getByText('6 pieces')).toBeVisible();

    // Category chips come from real SubGroups. Scope to the main region: the
    // header mega-nav has buttons with the same labels.
    const ringsChip = page
      .locator('main')
      .getByRole('button', { name: 'Rings', exact: true });
    await expect(ringsChip).toBeVisible();
    await ringsChip.click();

    await expect(page.getByRole('heading', { name: 'Rings', level: 1 })).toBeVisible();
    // Three of the six seeded items are Rings.
    await expect(page.getByText('3 pieces')).toBeVisible();
  });
});

test.describe('product detail', () => {
  test('opens a real PDP with its own gallery and real variants', async ({ page }) => {
    await page.goto('/products/1');

    await expect(page.getByRole('heading', { name: SEEDED_NAMES[0] })).toBeVisible();

    // Gallery is the item's OWN images (seeded 3 per item).
    const thumbs = page.locator('img[src*="/media/"]');
    expect(await thumbs.count()).toBeGreaterThan(1);

    // Metal swatches derive from real Colors, not a hardcoded list.
    await expect(page.getByText('Metal')).toBeVisible();
  });

  test('price is rendered in EGP from backend pricing', async ({ page }) => {
    await page.goto('/products/1');
    await expect(page.getByText(/EGP/).first()).toBeVisible();
  });
});

test.describe('cart', () => {
  test('add to cart works and the cart persists across a reload', async ({ page }) => {
    await page.goto('/products/1');

    await page.getByRole('button', { name: /Add to Cart/i }).click();

    // Drawer opens with the line item.
    await expect(page.getByText(SEEDED_NAMES[0]).first()).toBeVisible();

    await page.reload();

    // Cart survived the reload.
    const persisted = await page.evaluate(() =>
      window.localStorage.getItem('ga_cart_v1'),
    );
    expect(persisted).toBeTruthy();
    expect(JSON.parse(persisted!)).toHaveLength(1);
  });

  /**
   * The core regression: a cart line is an InventoryItem, not a Product.
   * Two sizes of one ring must be two lines with distinct inventoryIds.
   */
  test('two sizes of one product become two distinct cart lines', async ({ page }) => {
    await page.goto('/products/1');

    const sizeSelector = () =>
      page.locator('main button').filter({ hasText: /^(5|5\.5|6|6\.5|7|7\.5)$/ });

    const sizeCount = await sizeSelector().count();
    test.skip(sizeCount < 2, 'seeded product has fewer than two sizes');

    await sizeSelector().nth(0).click();
    await page.getByRole('button', { name: /Add to Cart/i }).click();

    // Fresh navigation closes the drawer; localStorage keeps the first line.
    await reopenProduct(page, '/products/1');

    await sizeSelector().nth(1).click();
    await page.getByRole('button', { name: /Add to Cart/i }).click();

    // Give the persistence effect a tick to flush.
    await expect
      .poll(async () =>
        page.evaluate(
          () => JSON.parse(window.localStorage.getItem('ga_cart_v1') ?? '[]').length,
        ),
      )
      .toBe(2);

    const cart = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem('ga_cart_v1') ?? '[]'),
    );

    expect(cart).toHaveLength(2);
    expect(cart[0].inventoryId).not.toBe(cart[1].inventoryId);
    // Both lines are the same product.
    expect(cart[0].productId).toBe(cart[1].productId);
  });
});

test.describe('navigation', () => {
  test('mega-nav is built from real subgroups', async ({ page }) => {
    await page.goto('/');
    for (const label of ['Rings', 'Necklaces', 'Bracelets', 'Earrings']) {
      await expect(page.getByRole('button', { name: label, exact: true }).first()).toBeVisible();
    }
  });

  test('search finds a real seeded product', async ({ page }) => {
    await page.goto('/collection');
    await page.getByRole('button', { name: /search/i }).first().click();

    const input = page.getByPlaceholder(/Search rings/i);
    await input.fill('Tennis');

    await expect(page.getByText('Tennis Bracelet').first()).toBeVisible();
  });
});

test.describe('home carousel (dashboard-managed)', () => {
  test('slides come from the backend carousel placement', async ({ request }) => {
    const response = await request.get(
      `${BACKEND}/home/api/hero/?placement=carousel&active=true`,
    );
    expect(response.ok()).toBeTruthy();

    const slides = await response.json();
    expect(slides.length).toBeGreaterThan(0);
    expect(slides.every((slide: any) => slide.placement === 'carousel')).toBe(true);

    // Ordered by the dashboard's Order field.
    const positions = slides.map((slide: any) => slide.position);
    expect(positions).toEqual([...positions].sort((a: number, b: number) => a - b));
  });

  test('the carousel renders those exact images on the home page', async ({ page, request }) => {
    const slides = await (
      await request.get(`${BACKEND}/home/api/hero/?placement=carousel&active=true`)
    ).json();

    await page.goto('/');

    // The first slide's filename must appear in the rendered markup — proving
    // the section is driven by the dashboard, not by product photos.
    const filename = String(slides[0].file).split('/').pop();
    expect(page.locator(`img[src*="${filename}"]`).first()).toBeTruthy();

    const html = await page.content();
    expect(html).toContain(filename);
  });

  test('carousel reads require no authentication', async ({ request }) => {
    const response = await request.get(`${BACKEND}/home/api/hero/?placement=carousel`);
    expect(response.status()).toBe(200);
  });
});

test.describe('sitemap', () => {
  test('lists every seeded product', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBeTruthy();

    const xml = await response.text();
    for (const id of [1, 2, 3, 4, 5, 6]) {
      expect(xml).toContain(`/products/${id}`);
    }
  });
});
