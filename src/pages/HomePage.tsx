import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getProducts } from "../services/api"
import type { Product } from "../types/product"
import { useCart } from "../store/cart"

function hasDiscount(price: number, discountedPrice: number) {
  return discountedPrice < price
}

function discountPercent(price: number, discountedPrice: number) {
  if (!hasDiscount(price, discountedPrice)) return 0
  return Math.round(((price - discountedPrice) / price) * 100)
}

export default function HomePage() {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState("")

  useEffect(() => {
    let isMounted = true

    async function run() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getProducts()
        if (!isMounted) return
        setProducts(data)
      } catch (e) {
        if (!isMounted) return
        setError(e instanceof Error ? e.message : "Unknown error")
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []

    return products
      .filter((p) => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        )
      })
      .slice(0, 8)
  }, [products, query])

  const showMatches = matches.length > 0

  if (isLoading) return <p>Loading products...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1>Products</h1>

      <div className="searchArea">
        <label className="searchLabel" htmlFor="search">
          Search
        </label>

        <input
          id="search"
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          autoComplete="off"
        />

        {showMatches && (
          <div className="searchBox">
            {matches.map((p) => (<button
  key={p.id}
  type="button"
  className="searchItem"
  onClick={() => {
    setQuery("")
    navigate(`/product/${p.id}`)
  }}
>
  <img
    className="searchThumb"
    src={p.image.url}
    alt={p.image.alt || p.title}
  />
  <span>{p.title}</span>
</button>
            ))}
          </div>
        )}
      </div>

      <div className="grid">
        {products.map((p) => {
          const discounted = hasDiscount(p.price, p.discountedPrice)
          const percent = discountPercent(p.price, p.discountedPrice)

          return (
            <article key={p.id} className="card">
              <Link to={`/product/${p.id}`} className="cardLink">
                <div className="thumbWrap">
                  {discounted && <span className="sticker">{percent}% OFF</span>}
                  <img className="thumb" src={p.image.url} alt={p.image.alt || p.title} />
                </div>

                <h2 className="title">{p.title}</h2>
                <p className="muted">Rating: {p.rating}/5</p>

                <div className="priceRow">
                  {discounted ? (
                    <>
                      <span className="strike">{p.price.toFixed(2)}</span>
                      <span className="price">{p.discountedPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="price">{p.price.toFixed(2)}</span>
                  )}
                </div>
              </Link>

              <button className="btn" onClick={() => addToCart(p)}>
                Add to cart
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}