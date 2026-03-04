import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Product } from "../types/product"

export type CartItem = {
  product: Product
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "frameworks_ca_cart"

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((x: any) => ({
        product: x?.product,
        quantity: Number(x?.quantity ?? 1),
      }))
      .filter((x: any) => x?.product?.id)
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }, [items])

  function addToCart(product: Product) {
    setItems((prev) => {
      const existing = prev.find((x) => x.product.id === product.id)
      if (existing) {
        return prev.map((x) =>
          x.product.id === product.id ? { ...x, quantity: x.quantity + 1 } : x
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  function removeFromCart(productId: string) {
    setItems((prev) => prev.filter((x) => x.product.id !== productId))
  }

  function setQuantity(productId: string, quantity: number) {
    const safeQty = Number.isFinite(quantity) ? quantity : 1
    setItems((prev) =>
      prev
        .map((x) =>
          x.product.id === productId ? { ...x, quantity: Math.max(1, safeQty) } : x
        )
        .filter((x) => x.quantity > 0)
    )
  }

  function clearCart() {
    setItems([])
  }

  const value: CartContextValue = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}