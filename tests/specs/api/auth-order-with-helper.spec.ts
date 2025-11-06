import { test, expect } from '@playwright/test'
import {
  fetchJwt,
  createOrder,
  getOrderById,
  deleteOrder,
  getDeletedOrderById,
  getAllOrders,
  changeOrderStatus,
  assignOrderToCourier,
} from '../../helpers/api-helper'
import { StatusDto } from '../../dto/status-dto'
import { OrderDto } from '../../dto/order-dto'

let jwt: string
let courierJwt: string

test.beforeAll(async ({ request }) => {
  jwt = await fetchJwt(request)
})

test('login and create order with api-helper', async ({ request }) => {
  const orderId = await createOrder(request, jwt)
  expect.soft(orderId).toBeGreaterThan(0)
})

test('create order and find order by id', async ({ request }) => {
  const orderId = await createOrder(request, jwt)
  expect.soft(orderId).toBeGreaterThan(0)
  const order: OrderDto = await getOrderById(request, jwt, orderId)
  expect.soft(order.id).toBe(orderId)
  expect.soft(order.status).toBe(StatusDto.OPEN)
})

test('create order and delete order and get deleted order', async ({ request }) => {
  const orderId = await createOrder(request, jwt)
  console.log(orderId)
  await deleteOrder(request, jwt, orderId)
  await getDeletedOrderById(request, jwt, orderId)
})

test('create two orders and get all orders', async ({ request }) => {
  const orderIdOne = await createOrder(request, jwt)
  expect.soft(orderIdOne).toBeGreaterThan(0)
  const orderIdTwo = await createOrder(request, jwt)
  expect.soft(orderIdOne).toBeGreaterThan(0)
  const allOrders = await getAllOrders(request, jwt)
  const order: OrderDto = await getOrderById(request, jwt, orderIdOne)
  const orderTwo: OrderDto = await getOrderById(request, jwt, orderIdTwo)
  expect.soft(order.id).toBe(orderIdOne)
  expect.soft(orderTwo.id).toBe(orderIdTwo)
  await getAllOrders(request, '')
  console.log(allOrders)
})

test('create an order and change its status', async ({ request }) => {
  const orderId = await createOrder(request, jwt)
  expect.soft(orderId).toBeGreaterThan(0)
  await assignOrderToCourier(courierJwt, orderId)
  const orderStatus = await changeOrderStatus(request, courierJwt, orderId, StatusDto.DELIVERED)
  expect.soft(orderStatus).toBe(StatusDto.DELIVERED)
  console.log(orderStatus)
})
