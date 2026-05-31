import type { Product } from "../types/product"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://v2.api.noroff.dev"
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/online-shop`, {
    headers: API_KEY
      ? {
          "X-Noroff-API-Key": API_KEY
        }
      : {}
  })

  if (!res.ok) {
    throw new Error("Failed to fetch products")
  }

  const json = await res.json()
  return json.data
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/online-shop/${id}`, {
    headers: API_KEY
      ? {
          "X-Noroff-API-Key": API_KEY
        }
      : {}
  })

  if (!res.ok) {
    throw new Error("Failed to fetch product")
  }

  const json = await res.json()
  return json.data
}
