import { test, expect } from '@playwright/test';

test.describe('Testes que precisam estar autenticados primeiro', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/livros');
    await page.fill('input[type="email"]', 'admin@sistema.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard|$/);
  });
  
  test('deve navegar até a tela de livros e listar o acervo', async ({ page }) => {
    // 1. Navega para livros a partir do menu ou via URL
    await page.goto('/livros/', { waitUntil: 'domcontentloaded' });

    // 2. Verifica se o título da página está correto
    await expect(page.locator('h2')).toContainText('Acervo de Livros');
  });

  test('deve permitir adicionar um novo livro e encontrá-lo na lista', async ({ page }) => {
    const tituloAleatorio = `Livro E2E ${Math.floor(Math.random() * 1000)}`;

    await page.goto('/livros');
    await page.locator('.fab').click();

    await page.getByPlaceholder('Ex: Dom Casmurro').fill(tituloAleatorio);
    await page.getByPlaceholder('Ex: Machado de Assis').fill('Automação Playwright');
    await page.getByRole('button', { name: 'Confirmar' }).click();

    const response = await responsePromise;
    const data = await response.json();
    const idCriado = data.id;

    await expect(page.addLocatorHandler('.modal')).not.toBeVisible();
    await page.fill('input[placeholder="Buscar por ID..."]',String(idCriado));
    await page.locator('button.bnt--primary').filter({has:page.locator('svg.lucide-search')}).click();
    await expect(page.locator('.list-card_title').toContainText(tituloAleatorio));
  });


  test('deve fechar o modal ao clicar no botão cancelar', async ({ page }) => {
    await page.goto('/livros');

    await page.locator('.fab').click();
    await expect(page.locator('.modal')).toBeVisible();

    await page.click('button:has-text("Cancelar")');
    await expect(page.locator('.modal')).not.toBeVisible();
  });
});