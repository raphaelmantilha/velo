import { test, expect } from '@playwright/test';

///AAA - Arrange, Act, Assert
///PAV - Preparar, Agir, Verificar 

test('deve consultar um pedido aprovado', async ({ page }) => {
  //Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint'); 
  
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();   //a[text()='Consultar Pedido']
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  // Act 
  //await page.getByTestId('search-order-id').fill('VLO-1LKL3P');
  //await page.getByLabel('Número do Pedido').fill('VLO-1LKL3P');
  //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-1LKL3P');
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-1LKL3P');
  
  //await page.getByTestId('search-order-button').click();
  //await page.locator('//button[text()="Buscar Pedido"]').click();
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  // Assert
  await expect(page.locator('//p[text()="Pedido"]/following-sibling::p')).toBeVisible({timeout: 10_000});
  await expect(page.locator('//p[text()="Pedido"]/following-sibling::p')).toContainText('VLO-1LKL3P');

  await expect(page.locator('//div[text()="APROVADO"]')).toBeVisible();
  await expect(page.locator('//div[text()="APROVADO"]')).toContainText('APROVADO');
});