# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: livros.spec.js >> Testes que precisam estar autenticados primeiro >> deve permitir adicionar um novo livro e encontrá-lo na lista
- Location: e2e\livros.spec.js:20:3

# Error details

```
ReferenceError: responsePromise is not defined
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - heading [level=1]
      - generic [ref=e6]:
        - button "Alternar tema" [ref=e7] [cursor=pointer]:
          - img [ref=e8]
        - button "Sair" [ref=e10] [cursor=pointer]:
          - img [ref=e11]
  - generic [ref=e15]:
    - generic [ref=e16]:
      - heading "Acervo de Livros" [level=2] [ref=e17]
      - paragraph [ref=e18]: Gerenciamento completo da biblioteca
    - generic [ref=e19]:
      - generic [ref=e20]: Erro ao salvar o livro.
      - button [ref=e21] [cursor=pointer]:
        - img [ref=e22]
    - generic [ref=e25]:
      - textbox "Buscar por ID..." [ref=e27]
      - button [ref=e28] [cursor=pointer]:
        - img [ref=e29]
    - generic [ref=e33]:
      - generic [ref=e34]:
        - generic [ref=e35]:
          - heading [level=3]
          - img [ref=e37]
        - generic [ref=e40]: "#"
      - generic [ref=e42]: Disponível para empréstimo em breve.
      - generic [ref=e43]:
        - button "Editar" [ref=e44] [cursor=pointer]:
          - img [ref=e45]
          - text: Editar
        - button "Excluir" [ref=e47] [cursor=pointer]:
          - img [ref=e48]
          - text: Excluir
    - button [ref=e51] [cursor=pointer]:
      - img [ref=e52]
    - generic [ref=e54]:
      - generic [ref=e55]:
        - heading "Novo Livro" [level=3] [ref=e56]
        - button [ref=e57] [cursor=pointer]:
          - img [ref=e58]
      - generic [ref=e61]:
        - generic [ref=e62]:
          - generic [ref=e63]:
            - generic [ref=e64]: Título do Livro
            - 'textbox "Ex: Dom Casmurro" [ref=e65]': Livro E2E 22
          - generic [ref=e66]:
            - generic [ref=e67]: Autor
            - 'textbox "Ex: Machado de Assis" [ref=e68]': Automação Playwright
        - generic [ref=e69]:
          - button "Cancelar" [ref=e70] [cursor=pointer]
          - button "Confirmar" [ref=e71] [cursor=pointer]
  - navigation "Navegação principal" [ref=e72]:
    - generic [ref=e73]:
      - link "Livros" [ref=e74] [cursor=pointer]:
        - /url: /livros
        - img [ref=e76]
        - generic [ref=e78]: Livros
      - link "Empréstimos" [ref=e79] [cursor=pointer]:
        - /url: /emprestimos
        - img [ref=e81]
        - generic [ref=e84]: Empréstimos
      - link "Início" [ref=e85] [cursor=pointer]:
        - /url: /
        - img [ref=e87]
        - generic [ref=e90]: Início
      - link "Multas" [ref=e91] [cursor=pointer]:
        - /url: /multas
        - img [ref=e93]
        - generic [ref=e95]: Multas
      - link "Equipe" [ref=e96] [cursor=pointer]:
        - /url: /usuarios
        - img [ref=e98]
        - generic [ref=e103]: Equipe
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Testes que precisam estar autenticados primeiro', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/livros');
  6  |     await page.fill('input[type="email"]', 'admin@sistema.com');
  7  |     await page.fill('input[type="password"]', '123456');
  8  |     await page.click('button[type="submit"]');
  9  |     await expect(page).toHaveURL(/\/dashboard|$/);
  10 |   });
  11 |   
  12 |   test('deve navegar até a tela de livros e listar o acervo', async ({ page }) => {
  13 |     // 1. Navega para livros a partir do menu ou via URL
  14 |     await page.goto('/livros/', { waitUntil: 'domcontentloaded' });
  15 | 
  16 |     // 2. Verifica se o título da página está correto
  17 |     await expect(page.locator('h2')).toContainText('Acervo de Livros');
  18 |   });
  19 | 
  20 |   test('deve permitir adicionar um novo livro e encontrá-lo na lista', async ({ page }) => {
  21 |     const tituloAleatorio = `Livro E2E ${Math.floor(Math.random() * 1000)}`;
  22 | 
  23 |     await page.goto('/livros');
  24 |     await page.locator('.fab').click();
  25 | 
  26 |     await page.getByPlaceholder('Ex: Dom Casmurro').fill(tituloAleatorio);
  27 |     await page.getByPlaceholder('Ex: Machado de Assis').fill('Automação Playwright');
  28 |     await page.getByRole('button', { name: 'Confirmar' }).click();
  29 | 
> 30 |     const response = await responsePromise;
     |                      ^ ReferenceError: responsePromise is not defined
  31 |     const data = await response.json();
  32 |     const idCriado = data.id;
  33 | 
  34 |     await expect(page.addLocatorHandler('.modal')).not.toBeVisible();
  35 |     await page.fill('input[placeholder="Buscar por ID..."]',String(idCriado));
  36 |     await page.locator('button.bnt--primary').filter({has:page.locator('svg.lucide-search')}).click();
  37 |     await expect(page.locator('.list-card_title').toContainText(tituloAleatorio));
  38 |   });
  39 | 
  40 | 
  41 |   test('deve fechar o modal ao clicar no botão cancelar', async ({ page }) => {
  42 |     await page.goto('/livros');
  43 | 
  44 |     await page.locator('.fab').click();
  45 |     await expect(page.locator('.modal')).toBeVisible();
  46 | 
  47 |     await page.click('button:has-text("Cancelar")');
  48 |     await expect(page.locator('.modal')).not.toBeVisible();
  49 |   });
  50 |   //excluir
  51 |   test('deve permitir excluir um li')
  52 | });
```