'use client'

import React, { useState, useEffect } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem 
}) => {
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cartAnalytics, setCartAnalytics] = useState({ views: 0, interactions: 0 })

  // Hidden Bug #1: Infinite re-renders due to object creation
  const shippingOptions = {
    standard: { price: 5.99, days: '5-7' },
    express: { price: 12.99, days: '2-3' },
    overnight: { price: 24.99, days: '1' }
  }

  useEffect(() => {
    // BUG: shippingOptions is recreated every render, causing infinite loop
    console.log('Calculating shipping...', shippingOptions)
    // This effect will run infinitely
  }, [shippingOptions])

  // Hidden Bug #2: Memory leak with scroll listener
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => {
        // Track scroll behavior in cart
        setCartAnalytics(prev => ({
          ...prev,
          interactions: prev.interactions + 1
        }))
      }

      // BUG: Adding listener but not removing when cart closes
      window.addEventListener('scroll', handleScroll)
      
      // Missing cleanup when isOpen changes to false
      // Should return cleanup function
    }
  }, [isOpen])

  // Hidden Bug #3: Expensive calculation on every render
  const calculateComplexDiscount = () => {
    // Simulate complex pricing algorithm
    let calculation = 0
    for (let i = 0; i < 50000; i++) {
      calculation += Math.random() * items.length
    }
    return calculation / 50000
  }

  const complexDiscount = calculateComplexDiscount() // BUG: Runs every render

  // Hidden Bug #4: XSS vulnerability in promo code
  const applyPromoCode = () => {
    setIsProcessing(true)
    
    // BUG: Directly executing user input as code
    try {
      // Simulate promo code validation with eval (DANGEROUS!)
      const promoResult = eval(`"${promoCode}".length > 5 ? 10 : 0`) // NEVER DO THIS!
      setDiscount(promoResult)
      
      // BUG: Storing user input without sanitization
      localStorage.setItem('lastPromoCode', promoCode)
      
      // BUG: Rendering user input as HTML
      const message = `<div>Promo code "${promoCode}" applied!</div>`
      document.getElementById('promo-message')!.innerHTML = message
    } catch (error) {
      console.error('Promo code error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Hidden Bug #5: Race condition in quantity updates
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    // BUG: No debouncing or request cancellation
    // Rapid clicks can cause race conditions
    
    try {
      // Simulate API call
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: newQuantity })
      })
      
      // BUG: Not checking if this is the latest request
      // Later requests might resolve before earlier ones
      if (response.ok) {
        onUpdateQuantity(itemId, newQuantity)
      }
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discountAmount = subtotal * (discount / 100)
  const total = subtotal - discountAmount + 5.99 // Standard shipping

  // Hidden Bug #6: Stale closure in auto-save
  useEffect(() => {
    const autoSave = setInterval(() => {
      // BUG: Captures initial items value, never updates
      console.log('Auto-saving cart:', items.length) // Always logs initial length
      
      if (items.length > 0) {
        localStorage.setItem('cartBackup', JSON.stringify(items))
      }
    }, 10000)

    return () => clearInterval(autoSave)
  }, []) // BUG: Empty dependency array captures stale items

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-gray-900 w-96 h-full overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 bg-gray-800 p-3 rounded">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-white font-medium">{item.name}</h3>
                <p className="text-gray-400">${item.price.toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button 
                    onClick={() => handleQuantityChange(item.id, Math.max(0, item.quantity - 1))}
                    className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
                  >
                    -
                  </button>
                  <span className="text-white">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-400 hover:text-red-300 ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-4">
          <div className="space-y-2 mb-4">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            />
            <button 
              onClick={applyPromoCode}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              {isProcessing ? 'Applying...' : 'Apply Promo Code'}
            </button>
            <div id="promo-message" className="text-green-400 text-sm"></div>
          </div>

          <div className="space-y-2 text-white">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount ({discount}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>$5.99</span>
            </div>
            <div className="flex justify-between">
              <span>Complex Discount:</span>
              <span>${complexDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded mt-4 font-medium">
            Checkout
          </button>

          <div className="text-xs text-gray-500 mt-2">
            Views: {cartAnalytics.views} | Interactions: {cartAnalytics.interactions}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCart 