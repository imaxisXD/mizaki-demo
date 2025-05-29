'use client'
import { useState } from "react"
import AnalyticsBanner from "./components/AnalyticsBanner"
import ProductCard from "./components/ProductCard"
import SearchBar from "./components/SearchBar"
import ShoppingCart from "./components/ShoppingCart"

// Mock data for the demo
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
    description: 'Premium <b>wireless</b> headphones with noise cancellation',
    inStock: true
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
    description: 'Advanced smartwatch with <em>health tracking</em>',
    inStock: true
  },
  {
    id: '3',
    name: 'Laptop Stand',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop',
    description: 'Ergonomic laptop stand for better <strong>productivity</strong>',
    inStock: false
  }
]

const mockSearchResults = [
  {
    id: '1',
    title: 'Wireless <script>alert("XSS")</script> Headphones',
    description: 'Best headphones for <b>music lovers</b>',
    url: 'javascript:alert("Clicked malicious link!")'
  },
  {
    id: '2',
    title: 'Smart Watch Collection',
    description: 'Latest smartwatch models',
    url: 'https://example.com/watches'
  }
]

export default function Home() {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 99.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
    }
  ])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleAddToCart = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId)
    if (product) {
      setCartItems(prev => {
        const existing = prev.find(item => item.id === productId)
        if (existing) {
          return prev.map(item => 
            item.id === productId 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image
        }]
      })
    }
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id))
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const handleSearch = (results: any[]) => {
    console.log('Search results:', results)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Analytics Banner with hidden bugs */}
      <AnalyticsBanner />
      
      <div className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-white">TechStore</h1>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar with hidden bugs */}
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search products..."
              />
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </button>
            </div>
          </header>

          {/* Product Grid */}
          <main className="py-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Featured Products</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-700 py-8 mt-12">
            <div className="text-center text-gray-400">
              <p>&copy; 2024 TechStore. All rights reserved.</p>
              <p className="text-sm mt-2">
                This demo contains intentionally hidden bugs for educational purposes.
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* Shopping Cart with hidden bugs */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  )
}
