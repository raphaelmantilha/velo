import { test } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'
import { NavbarComponent } from '../support/components/NavbarComponent'
import { LandingPage } from '../support/pages/LandingPage'
import { OrderLockupPage, OrderDetails } from '../support/pages/OrderLockupPage'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  let orderLockupPage: OrderLockupPage

  test.beforeEach(async ({ page }) => {
    await new LandingPage(page).goto()
    await new NavbarComponent(page).orderLockupLink()

    orderLockupPage = new OrderLockupPage(page)
    await new OrderLockupPage(page).validateLoaded()
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-1LKL3P',
      status: 'APROVADO' as const,
      color: 'Glacier Blue',
      wheels: 'sport Wheels',
      customer: {
        name: 'Raphael Mantilha',
        email: 'raphael.mantilha@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act  
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await orderLockupPage.validateOrderDetails(order)

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-OTZH8V',
      status: 'REPROVADO' as const,
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Márcio Amoroso',
        email: 'amoroso@guaranifc.com.br'
      },
      payment: 'À Vista'
    }

    // Act  
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await orderLockupPage.validateOrderDetails(order)

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ page }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-NMMNB1',
      status: 'EM_ANALISE' as const,
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Sandra Mantilha',
        email: 'sandra.mantilha@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act  
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await orderLockupPage.validateOrderDetails(order)

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = generateOrderCode()

    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order)

    await orderLockupPage.validateOrderNotFound();
  })

  test('deve exibir mensagem quando o pedido em qualquer formato não é encontrado', async ({ page }) => {

    const order = 'ABC123'

    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order)

    await orderLockupPage.validateOrderNotFound();
  })
})