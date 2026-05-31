import { Link, NavLink } from "react-router-dom"
import { useCart } from "../store/cart"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { totalItems, cartMessage, clearCartMessage } = useCart()

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          Shop
        </Link>

        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Products
          </NavLink>

          <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")}>
            Cart ({totalItems})
          </NavLink>

          <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
            Contact
          </NavLink>
        </nav>
      </header>

      {cartMessage && (
        <div className="toast" role="status" aria-live="polite">
          <span>{cartMessage}</span>
          <button type="button" onClick={clearCartMessage} aria-label="Close message">
            ×
          </button>
        </div>
      )}

      <main className="container">{children}</main>
    </>
  )
}
