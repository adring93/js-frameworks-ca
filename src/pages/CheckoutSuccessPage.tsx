import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../store/cart"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()
  const hasCleared = useRef(false)

  useEffect(() => {
    if (hasCleared.current) return
    hasCleared.current = true
    clearCart()
  }, [clearCart])

  return (
    <div>
      <h1>Success</h1>
      <p>Thanks for your order. Your cart has been cleared.</p>
      <Link className="btnLink" to="/">
        Back to products
      </Link>
    </div>
  )
}