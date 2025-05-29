'use client'

import { useState } from 'react'
import AnalyticsBanner from './AnalyticsBanner'
import ProductCard from './ProductCard'

interface BugExplanation {
  title: string
  component: React.ReactNode
  bugs: {
    name: string
    description: string
    whyHardToCatch: string
    howToTest: string
    impact: string
  }[]
}

const BugDemo = () => {
  const [currentPage, setCurrentPage] = useState(0)

  const mockProduct = {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
    description: 'Premium <b>wireless</b> headphones with <em>noise cancellation</em>. <strong style="color: red; font-size: 18px;">⚠️ XSS VULNERABILITY DEMO</strong><br><img src="invalid-url" onerror="this.style.display=\'none\'; this.parentElement.style.border=\'3px solid red\'; this.parentElement.innerHTML += \'<div style=\\\"background: red; color: white; padding: 10px; margin: 10px 0;\\\">🚨 XSS EXECUTED! This could steal your data!</div>\';" style="display:none;"><br>This HTML injection shows how malicious code could execute.',
    inStock: true
  }

  const bugDemos: BugExplanation[] = [
    {
      title: "Analytics Banner - Cost Explosion Bug",
      component: <AnalyticsBanner />,
      bugs: [
        {
          name: "Infinite Analytics Events",
          description: "Analytics events fire on every render without proper controls, rate limiting, or user consent.",
          whyHardToCatch: "• Looks like normal analytics tracking\n• No immediate visual errors\n• Works fine in development\n• Only shows cost impact at scale",
          howToTest: "1. Open browser console\n2. Watch analytics events fire continuously\n3. Hover over banner repeatedly\n4. Notice events fire on every mouse movement\n5. Check localStorage for growing data",
          impact: "💸 At 10,000 users: 50,000+ events/day = $500-5000/month in analytics costs"
        }
      ]
    },
    {
      title: "Product Card - Multiple Critical Bugs",
      component: (
        <div className="max-w-sm mx-auto">
          <ProductCard 
            product={mockProduct} 
            onAddToCart={(id) => console.log('Added to cart:', id)} 
          />
        </div>
      ),
      bugs: [
        {
          name: "XSS Vulnerability - CRITICAL",
          description: "Product descriptions are rendered with dangerouslySetInnerHTML without sanitization.",
          whyHardToCatch: "• dangerouslySetInnerHTML is a React feature\n• Looks like intentional HTML rendering\n• No validation seems normal\n• Security testing often skipped",
          howToTest: "1. Look at the product description below\n2. You should see a RED BORDER around the description\n3. Notice the red warning message that was injected\n4. This demonstrates successful HTML/JS injection\n5. Check DevTools Console for any errors\n6. Inspect the description element in DevTools\n7. See how the onerror handler executed and modified the DOM\n8. This bypasses CSP because it uses DOM manipulation, not inline scripts",
          impact: "💀 CRITICAL: Script injection, data theft, session hijacking"
        },
        {
          name: "Memory Leak - Event Listeners",
          description: "Global mousemove event listeners are added but never removed, accumulating with each component mount.",
          whyHardToCatch: "• Event listener code looks normal\n• No immediate performance issues\n• Only shows after extended use\n• Memory usage grows slowly",
          howToTest: "1. Hover over product card\n2. Navigate away and back multiple times\n3. Open DevTools > Performance tab\n4. Monitor memory usage over time\n5. Notice increasing event listeners in DevTools",
          impact: "🧠 Browser memory increases continuously, eventual crashes on mobile devices"
        },
        {
          name: "Infinite Re-renders",
          description: "trackingData object is recreated on every render, causing useEffect to run infinitely.",
          whyHardToCatch: "• Object creation looks innocent\n• useEffect appears properly structured\n• No obvious infinite loop\n• Console logs may be overlooked",
          howToTest: "1. Open browser console\n2. Hover over product card\n3. Watch console logs fire rapidly and continuously\n4. Notice they never stop even when not interacting\n5. Check React DevTools Profiler for constant re-renders",
          impact: "⚡ High CPU usage, battery drain, poor performance"
        },
        {
          name: "Performance Issue",
          description: "Expensive recommendation calculation runs on every render instead of being memoized.",
          whyHardToCatch: "• Function call looks normal\n• No obvious performance indicators\n• Works fine with small datasets\n• Only noticeable under load",
          howToTest: "1. Open browser console\n2. Hover over product multiple times\n3. Watch for performance-related console logs\n4. Notice calculation runs on every interaction\n5. Check Performance tab for CPU spikes",
          impact: "🐌 UI becomes sluggish, poor user experience"
        }
      ]
    }
  ]

  const currentDemo = bugDemos[currentPage]

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % bugDemos.length)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + bugDemos.length) % bugDemos.length)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🐛 Hidden Bug Demonstration</h1>
          <p className="text-gray-300 text-lg">
            Components that look normal but contain dangerous bugs
          </p>
          <div className="mt-4 text-sm text-gray-400">
            Page {currentPage + 1} of {bugDemos.length}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={prevPage}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center"
          >
            ← Previous
          </button>
          
          <h2 className="text-2xl font-semibold text-center">
            {currentDemo.title}
          </h2>
          
          <button
            onClick={nextPage}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center"
          >
            Next →
          </button>
        </div>

        {/* Component Demo */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">🎭 Component Demo</h3>
          <div className="bg-gray-900 rounded-lg p-4">
            {currentDemo.component}
          </div>
        </div>

        {/* Bug Explanations */}
        <div className="space-y-6">
          {currentDemo.bugs.map((bug, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-400 mb-4">
                🚨 {bug.name}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">📝 What's the Bug?</h4>
                  <p className="text-gray-300 mb-4">{bug.description}</p>
                  
                  <h4 className="font-semibold text-orange-400 mb-2">🤔 Why Hard to Catch?</h4>
                  <pre className="text-gray-300 text-sm whitespace-pre-line bg-gray-900 p-3 rounded">
                    {bug.whyHardToCatch}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">🧪 How to Test</h4>
                  <pre className="text-gray-300 text-sm whitespace-pre-line bg-gray-900 p-3 rounded mb-4">
                    {bug.howToTest}
                  </pre>
                  
                  <h4 className="font-semibold text-red-400 mb-2">💥 Impact</h4>
                  <p className="text-gray-300 font-medium">{bug.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {bugDemos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentPage ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">⚠️ Educational Purpose</h3>
          <p className="text-gray-300">
            These bugs are intentionally created for learning. 
            <strong className="text-red-400"> Never use these patterns in production!</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export default BugDemo 