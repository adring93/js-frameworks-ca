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
  cartMessage: string | null
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  clearCartMessage: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "frameworks_ca_cart"

function getProductPrice(product: Product) {
  if (
    typeof product.discountedPrice === "number" &&
    product.discountedPrice > 0 &&
    product.discountedPrice < product.price
  ) {
    return product.discountedPrice
  }

  return product.price
}

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
  const [cartMessage, setCartMessage] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (!cartMessage) return

    const timer = window.setTimeout(() => {
      setCartMessage(null)
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [cartMessage])

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + getProductPrice(item.product) * item.quantity
    }, 0)
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

    setCartMessage(`${product.title} added to cart`)
  }

  function removeFromCart(productId: string) {
    setItems((prev) => prev.filter((x) => x.product.id !== productId))
  }

  function setQuantity(productId: string, quantity: number) {
    const safeQty = Number.isFinite(quantity) ? quantity : 1

    setItems((prev) =>
      prev.map((x) =>
        x.product.id === productId ? { ...x, quantity: Math.max(1, safeQty) } : x
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  function clearCartMessage() {
    setCartMessage(null)
  }

  const value: CartContextValue = {
    items,
    totalItems,
    totalPrice,
    cartMessage,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
    clearCartMessage,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
