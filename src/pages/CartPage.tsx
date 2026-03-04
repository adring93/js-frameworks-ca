import { Link } from "react-router-dom"
import { useCart } from "../store/cart"

export default function CartPage() {
  const { items, totalPrice, removeFromCart, setQuantity, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div>
        <h1>Cart</h1>
        <p>Your cart is empty.</p>
        <Link className="btnLink" to="/">
          Go to products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Cart</h1>

      <div className="cart">
        {items.map((item) => (
          <div key={item.product.id} className="cartRow">
            <img
              className="cartImg"
              src={item.product.image.url}
              alt={item.product.image.alt || item.product.title}
            />

            <div>
              <p className="cartTitle">{item.product.title}</p>

              <p className="price">
                {(
                  (item.product.discountedPrice < item.product.price
                    ? item.product.discountedPrice
                    : item.product.price) * item.quantity
                ).toFixed(2)}
              </p>

              <div className="row">
                <label>
                  Qty{" "}
                  <input
                    className="qty"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => setQuantity(item.product.id, Number(e.target.value))}
                  />
                </label>

                <button className="btnSecondary" onClick={() => removeFromCart(item.product.id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        <strong>Total: {totalPrice.toFixed(2)}</strong>
        <div className="row">
          <button className="btnSecondary" onClick={clearCart}>
            Clear
          </button>
          <Link className="btn" to="/success">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}