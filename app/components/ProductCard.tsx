'use client'

import React, { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  inStock: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [lastViewed, setLastViewed] = useState<Date | null>(null)

  // Hidden Bug #1: Memory leak - event listener not cleaned up
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Track mouse movement for "analytics"
      if (isHovered) {
        setViewCount(prev => prev + 1)
      }
    }
    
    // BUG: Adding global event listener but never removing it
    document.addEventListener('mousemove', handleMouseMove)
    
    // Missing cleanup - this will accumulate listeners
    // return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [isHovered])

  // Hidden Bug #2: Infinite re-renders due to object in dependency
  const trackingData = {
    productId: product.id,
    timestamp: Date.now(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : ''
  }

  useEffect(() => {
    // "Analytics tracking" that runs infinitely
    if (isHovered) {
      setLastViewed(new Date())
    }
  }, [trackingData, isHovered]) // BUG: trackingData is always new

  // Hidden Bug #3: Expensive calculation on every render
  const calculateRecommendationScore = () => {
    // Simulate complex recommendation algorithm
    let score = 0
    for (let i = 0; i < 100000; i++) {
      score += Math.random() * product.price
    }
    return score / 100000
  }

  const recommendationScore = calculateRecommendationScore() // BUG: Runs every render

  // Hidden Bug #4: XSS vulnerability in product description
  const renderDescription = () => {
    // BUG: Directly rendering HTML without sanitization
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: product.description }}
        className="text-sm text-gray-300 mt-2"
      />
    )
  }

  const handleAddToCart = () => {
    // Hidden Bug #5: Race condition - multiple rapid clicks
    // No debouncing or loading state
    onAddToCart(product.id)
    
    // BUG: Storing sensitive data in localStorage without validation
    const cartHistory = localStorage.getItem('cartHistory') || '[]'
    const history = JSON.parse(cartHistory)
    history.push({
      productId: product.id,
      timestamp: Date.now(),
      userAgent: navigator.userAgent, // Sensitive data
      price: product.price
    })
    localStorage.setItem('cartHistory', JSON.stringify(history))
  }

  return (
    <div 
      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover rounded-md"
        />
        {isHovered && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            Views: {viewCount}
          </div>
        )}
      </div>
      
      <h3 className="text-white font-semibold mt-3">{product.name}</h3>
      
      {renderDescription()}
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-green-400 font-bold text-lg">
          ${product.price.toFixed(2)}
        </span>
        <span className="text-xs text-gray-500">
          Score: {recommendationScore.toFixed(1)}
        </span>
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <span className={`text-xs ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
        {lastViewed && (
          <span className="text-xs text-gray-500">
            Last viewed: {lastViewed.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={!product.inStock}
        className={`w-full mt-3 py-2 px-4 rounded-md font-medium transition-colors ${
          product.inStock 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  )
}

export default ProductCard 