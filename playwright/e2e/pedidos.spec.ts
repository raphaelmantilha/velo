import { test, expect } from '@playwright/test';

import { generateOrderCode } from '../support/helpers';

import { OrderLockupPage } from '../support/pages/OrderLockupPage';

///AAA - Arrange, Act, Assert
///PAV - Preparar, Agir, Verificar

test.describe('Consulta de Pedido', () => {

  let orderLockupPage: OrderLockupPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

    await page.getByRole('link', { name: 'Consultar Pedido' }).click();   //a[text()='Consultar Pedido']
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

    orderLockupPage = new OrderLockupPage(page)
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-1LKL3P',
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheels: 'sport Wheels',
      customer: {
        name: 'Raphael Mantilha',
        email: 'raphael.mantilha@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act 
    //await page.getByTestId('search-order-id').fill('VLO-1LKL3P');
    //await page.getByLabel('Número do Pedido').fill('VLO-1LKL3P');
    //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-1LKL3P');
    //await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);

    //await page.getByTestId('search-order-button').click();
    //await page.locator('//button[text()="Buscar Pedido"]').click();
    //await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // Assert
    // await expect(page.locator('//p[text()="Pedido"]/following-sibling::p')).toBeVisible({timeout: 10_000});
    // await expect(page.locator('//p[text()="Pedido"]/following-sibling::p')).toContainText('VLO-1LKL3P');

    // const containerPedido = page.getByRole('paragraph')
    //   .filter({ hasText: /^Pedido$/ })
    //   .locator('..') // Sobe para o elemento pai (a div que agrupa ambos)

    // await expect(containerPedido).toContainText(order, { timeout: 10_000 })

    // await expect(page.locator('//div[text()="APROVADO"]')).toBeVisible();
    // await expect(page.locator('//div[text()="APROVADO"]')).toContainText('APROVADO');

    orderLockupPage.searchOrder(order.number)

    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

      const statusBadge = page.getByRole('status').filter({hasText: order.status})

      await expect(statusBadge).toHaveClass(/bg-green-100/)
      await expect(statusBadge).toHaveClass(/text-green-700/)

      const statusIcon = statusBadge.locator('svg')
      await expect(statusIcon).toHaveClass(/lucide-circle-check-big/)
  });

  test('deve consultar um pedido reprovado', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-OTZH8V',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Márcio Amoroso',
        email: 'amoroso@guaranifc.com.br'
      },
      payment: 'À Vista'
    }

    // Act 
    orderLockupPage.searchOrder(order.number)

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

      const statusBadge = page.getByRole('status').filter({hasText: order.status})

      await expect(statusBadge).toHaveClass(/bg-red-100/)
      await expect(statusBadge).toHaveClass(/text-red-700/)

      const statusIcon = statusBadge.locator('svg')
      await expect(statusIcon).toHaveClass(/lucide-circle-x/)
  });

  test('deve consultar um pedido em analise', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-NMMNB1',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Sandra Mantilha',
        email: 'sandra.mantilha@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act 
    orderLockupPage.searchOrder(order.number)

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

      const statusBadge = page.getByRole('status').filter({ hasText: order.status })

      await expect(statusBadge).toHaveClass(/bg-amber-100/)
      await expect(statusBadge).toHaveClass(/text-amber-700/)

      const statusIcon = statusBadge.locator('svg')
      await expect(statusIcon).toHaveClass(/lucide-clock/)
  });

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = generateOrderCode()

    orderLockupPage.searchOrder(order)


    await expect(page.locator('#root')).toContainText('Pedido não encontrado');
    await expect(page.locator('#root')).toContainText('Verifique o número do pedido e tente novamente');

    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `);
  })
})
