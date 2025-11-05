import { APIRequestContext, expect } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from '../dto/login-dto'
import { OrderDto } from '../dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'

export async function fetchJwt(request: APIRequestContext): Promise<string> {
  const authResponse = await request.post(`${serviceURL}${loginPath}`, {
    data: LoginDto.createLoginWithCorrectData(),
  })
  // if (authResponse.status() !== StatusCodes.OK) {
  //   throw new Error(`Authorization failed. Status: ${authResponse.status()}`)
  // }
  return await authResponse.text()
}

export async function createOrder(request: APIRequestContext, jwt: string): Promise<number> {
  const response = await request.post(`${serviceURL}${orderPath}`, {
    data: OrderDto.createOrderWithRandomData(),
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  return responseBody.id
}

export async function getOrderById(
  request: APIRequestContext,
  jwt: string,
  id: number,
): Promise<OrderDto> {
  const response = await request.get(`${serviceURL}${orderPath}/${id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const data = await response.json()
  return new OrderDto(
    data.status,
    data.courierId,
    data.customerName,
    data.customerPhone,
    data.comment,
    data.id,
  )
}

export async function deleteOrder(request: APIRequestContext, jwt: string, orderId: number): Promise<void> {
  const response = await request.delete(`${serviceURL}${orderPath}/${orderId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  expect(response.status()).toBe(StatusCodes.OK)
}

export async function getDeletedOrderById(
  request: APIRequestContext,
  jwt: string,
  id: number,
):  Promise<void> {
  const response = await request.get(`${serviceURL}${orderPath}/${id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const data = await response.text()
  expect(data).toBe('')
}

class OrderStatus {}

export async function changeOrderStatus(
  request: APIRequestContext,
  jwt: string,
  orderId: number,
  status: OrderStatus,
): Promise<void> {
  const response = await request.post(`${serviceURL}${orderPath}/${orderId}/status`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    data: {
      status,
    },
  })
  expect(response.status()).toBe(StatusCodes.OK)
}

export async function getAllOrders(request: APIRequestContext, jwt: string): Promise<OrderDto[]> {
  const response = await request.get(`${serviceURL}${orderPath}/${orderPath}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const data = await response.json()
  return data.map((order: any) => new OrderDto(
    order.status,
    order.courierId,
    order.customerName,
    order.customerPhone,
    order.comment,
    order.id,
  ))
}

export async function assignOrderToCourier() {

}
