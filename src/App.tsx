import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import ProductPage from "./pages/ProductPage"
import CartPage from "./pages/CartPage"
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage"
import ContactPage from "./pages/ContactPage"

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/success" element={<CheckoutSuccessPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
