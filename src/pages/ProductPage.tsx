import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getProductById } from "../services/api"
import type { Product } from "../types/product"
import { useCart } from "../store/cart"

function hasDiscount(price: number, discountedPrice: number) {
  return discountedPrice < price
}

export default function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function run(productId: string) {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getProductById(productId)
        if (!isMounted) return
        setProduct(data)
      } catch (e) {
        if (!isMounted) return
        setError(e instanceof Error ? e.message : "Unknown error")
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    }

    if (id) run(id)
    else {
      setError("Missing product id")
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [id])

  const priceView = useMemo(() => {
    if (!product) return null
    const discounted = hasDiscount(product.price, product.discountedPrice)
    return {
      discounted,
      original: product.price,
      final: discounted ? product.discountedPrice : product.price,
    }
  }, [product])

  if (isLoading) return <p>Loading product...</p>
  if (error) return <p>Error: {error}</p>
  if (!product || !priceView) return <p>Not found</p>

  return (
    <div>
      <Link className="btnSecondary" to="/">
        Back
      </Link>

      <div className="product">
        <img
          className="productImg"
          src={product.image.url}
          alt={product.image.alt || product.title}
        />

        <div>
          <h1>{product.title}</h1>
          <p className="muted">Rating: {product.rating}/5</p>

          <div className="priceRow" style={{ marginBottom: 12 }}>
            {priceView.discounted ? (
              <>
                <span className="strike">{priceView.original.toFixed(2)}</span>
                <span className="price">{priceView.final.toFixed(2)}</span>
              </>
            ) : (
              <span className="price">{priceView.original.toFixed(2)}</span>
            )}
          </div>

          <button className="btn" onClick={() => addToCart(product)}>
            Add to cart
          </button>

          <div style={{ marginTop: 16 }}>
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>

          {product.tags.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h2>Tags</h2>
              <div className="tags">
                {product.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.reviews.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h2>Reviews</h2>
              <div className="reviews">
                {product.reviews.map((r) => (
                  <div key={r.id} className="review">
                    <div className="reviewTop">
                      <strong>{r.username}</strong>
                      <span className="muted">{r.rating}/5</span>
                    </div>
                    <p style={{ margin: 0 }}>{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.reviews.length === 0 && (
            <div style={{ marginTop: 16 }}>
              <h2>Reviews</h2>
              <p className="muted">No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}