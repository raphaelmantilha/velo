import { test, expect } from '@playwright/test';

import { generateOrderCode } from '../support/helpers';

///AAA - Arrange, Act, Assert
///PAV - Preparar, Agir, Verificar

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

    await page.getByRole('link', { name: 'Consultar Pedido' }).click();   //a[text()='Consultar Pedido']
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    const order = 'VLO-1LKL3P'

    // Act 
    //await page.getByTestId('search-order-id').fill('VLO-1LKL3P');
    //await page.getByLabel('Número do Pedido').fill('VLO-1LKL3P');
    //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-1LKL3P');
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);

    //await page.getByTestId('search-order-button').click();
    //await page.locator('//button[text()="Buscar Pedido"]').click();
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // Assert
    // await expect(page.locator('//p[text()="Pedido"]/following-sibling::p')).toBeVisible({timeout: 10_000});
    // await expect(page.locator('//p[text()="Pedido"]/following-sibling::p')).toContainText('VLO-1LKL3P');

    const containerPedido = page.getByRole('paragraph')
      .filter({ hasText: /^Pedido$/ })
      .locator('..') // Sobe para o elemento pai (a div que agrupa ambos)

    await expect(containerPedido).toContainText(order, { timeout: 10_000 })

    await expect(page.locator('//div[text()="APROVADO"]')).toBeVisible();
    await expect(page.locator('//div[text()="APROVADO"]')).toContainText('APROVADO');
  });

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = generateOrderCode()
    
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    await expect(page.locator('#root')).toContainText('Pedido não encontrado');
    await expect(page.locator('#root')).toContainText('Verifique o número do pedido e tente novamente');

    // const title = page.getByRole('heading', {name: 'Pedido não encontrado', level: 3}) // Sem o level 3, busca um "h" independente do nível.
    // await expect(title).toBeVisible()

    // // Não funciona
    // // const message = page.getByRole('paragraph', {name: 'Verifique o número do pedido e tente novamente'})

    // //const message = page.locator('//p[text()="Verifique o número do pedido e tente novamente"]')
    // const message = page.locator('p', {hasText: 'Verifique o número do pedido e tente novamente'})
    // await expect(message).toBeVisible()

    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `);
  })
})
