import { test } from '../support/fixtures'
import type { OrderDetails } from '../support/actions/orderLockupActions'

import { generateOrderCode } from '../support/helpers'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ app }) => {
    await app.orderLockup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {

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
    await app.orderLockup.searchOrder(order.number)

    // Assert
    await app.orderLockup.validateOrderDetails(order)

    // Validação do badge de status encapsulada no Page Object
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ app }) => {

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
    await app.orderLockup.searchOrder(order.number)

    // Assert
    await app.orderLockup.validateOrderDetails(order)

    // Validação do badge de status encapsulada no Page Object
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {

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
    await app.orderLockup.searchOrder(order.number)

    // Assert
    await app.orderLockup.validateOrderDetails(order)

    // Validação do badge de status encapsulada no Page Object
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {

    const order = generateOrderCode()

    await app.orderLockup.searchOrder(order)
    await app.orderLockup.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o pedido em qualquer formato não é encontrado', async ({ app }) => {

    const order = 'ABC123'

    await app.orderLockup.searchOrder(order)
    await app.orderLockup.validateOrderNotFound()
  })
})