import type { Product, Order, Booking, Request as PrismaRequest } from '@/generated/prisma/client'

export type CartItem = {
  product: Product
  quantity: number
}

export type Cart = {
  items: CartItem[]
  total: number
}

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export type ProductWithCategory = Product & {
  category: {
    id: string
    name: string
    slug: string
  }
}

export type { Product, Order, Booking, PrismaRequest }
