'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

// 🐛 BUG #1: Memory Leak - Event listeners not cleaned up
const LeakyComponent = () => {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    
    // BUG: Adding event listener but never removing it
    window.addEventListener('scroll', handleScroll)
    
    // Missing cleanup function - this will cause memory leaks
    // return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return <div>Scroll position: {scrollPosition}</div>
}

// 🐛 BUG #2: Race Condition - Async state updates
const RaceConditionComponent = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchUser = async (userId: string) => {
    setLoading(true)
    
    // BUG: No cleanup for previous requests
    // If user clicks rapidly, multiple requests fire
    // Later requests might resolve before earlier ones
    const response = await fetch(`/api/users/${userId}`)
    const data = await response.json()
    
    // BUG: This might set stale data if a newer request already completed
    setUserData(data)
    setLoading(false)
  }

  return (
    <div>
      <button onClick={() => fetchUser('1')}>Load User 1</button>
      <button onClick={() => fetchUser('2')}>Load User 2</button>
      <button onClick={() => fetchUser('3')}>Load User 3</button>
      {loading && <p>Loading...</p>}
      {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}
    </div>
  )
}

// 🐛 BUG #3: XSS Vulnerability - Dangerous innerHTML usage
const XSSVulnerableComponent = () => {
  const [userComment, setUserComment] = useState('')
  const [comments, setComments] = useState<string[]>([])

  const addComment = () => {
    // BUG: Directly adding user input to state without sanitization
    // If user enters: <script>alert('XSS')</script>
    // It will execute when rendered with dangerouslySetInnerHTML
    setComments([...comments, userComment])
    setUserComment('')
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#2d2d2d', color: '#e0e0e0' }}>
      <h3>Comments (XSS Vulnerable)</h3>
      <input
        value={userComment}
        onChange={(e) => setUserComment(e.target.value)}
        placeholder="Enter comment (try: <script>alert('XSS')</script>)"
        style={{ padding: '8px', marginRight: '10px', width: '300px' }}
      />
      <button onClick={addComment} style={{ padding: '8px 16px' }}>
        Add Comment
      </button>
      
      <div style={{ marginTop: '20px' }}>
        {comments.map((comment, index) => (
          <div 
            key={index}
            // BUG: This is extremely dangerous!
            dangerouslySetInnerHTML={{ __html: comment }}
            style={{ 
              padding: '10px', 
              margin: '5px 0', 
              backgroundColor: '#1a1a1a',
              border: '1px solid #555'
            }}
          />
        ))}
      </div>
    </div>
  )
}

// 🐛 BUG #4: Infinite Re-renders - Object/Array in dependency
const InfiniteRenderComponent = () => {
  const [count, setCount] = useState(0)
  const [data, setData] = useState({ items: [] })

  // BUG: Object is recreated on every render, causing infinite loop
  const config = { 
    apiUrl: '/api/data',
    timeout: 5000 
  }

  useEffect(() => {
    console.log('Effect running...') // This will log infinitely
    // Simulate some work
    setData({ items: [`Item ${count}`] })
  }, [config, count]) // BUG: config is always a new object reference

  return (
    <div style={{ padding: '20px', backgroundColor: '#2d2d2d', color: '#e0e0e0' }}>
      <h3>Infinite Render Bug</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <p>Check console - effect runs infinitely!</p>
    </div>
  )
}

// 🐛 BUG #5: Stale Closure - Capturing old state values
const StaleClosureComponent = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      // BUG: This captures the initial value of count (0)
      // It will always log 1, never increment properly
      console.log('Current count:', count)
      setCount(count + 1) // Always sets to 0 + 1 = 1
    }, 2000)

    return () => clearInterval(interval)
  }, []) // BUG: Empty dependency array means count is stale

  return (
    <div style={{ padding: '20px', backgroundColor: '#2d2d2d', color: '#e0e0e0' }}>
      <h3>Stale Closure Bug</h3>
      <p>Count: {count} (should increment every 2s, but gets stuck at 1)</p>
      <button onClick={() => setCount(c => c + 1)}>Manual Increment</button>
    </div>
  )
}

// 🐛 BUG #6: Performance Issue - Expensive calculation on every render
const PerformanceIssueComponent = () => {
  const [items, setItems] = useState(Array.from({ length: 1000 }, (_, i) => i))
  const [filter, setFilter] = useState('')

  // BUG: This expensive calculation runs on EVERY render
  // Should be wrapped in useMemo
  const expensiveCalculation = () => {
    console.log('Expensive calculation running...') // Will log on every keystroke
    let result = 0
    for (let i = 0; i < 1000000; i++) {
      result += Math.random()
    }
    return result
  }

  const expensiveValue = expensiveCalculation() // BUG: Runs every render

  const filteredItems = items.filter(item => 
    item.toString().includes(filter)
  )

  return (
    <div style={{ padding: '20px', backgroundColor: '#2d2d2d', color: '#e0e0e0' }}>
      <h3>Performance Issue</h3>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items (check console for performance issue)"
        style={{ padding: '8px', marginBottom: '10px', width: '300px' }}
      />
      <p>Expensive calculation result: {expensiveValue.toFixed(2)}</p>
      <p>Filtered items: {filteredItems.length}</p>
    </div>
  )
}

// 🐛 BUG #7: Security Issue - Eval usage and localStorage without validation
const SecurityIssueComponent = () => {
  const [code, setCode] = useState('Math.random()')
  const [result, setResult] = useState('')

  const executeCode = () => {
    try {
      // BUG: Using eval is extremely dangerous!
      // User can execute arbitrary JavaScript
      const output = eval(code) // NEVER DO THIS!
      setResult(String(output))
      
      // BUG: Storing user input directly in localStorage without validation
      localStorage.setItem('lastCode', code)
    } catch (error) {
      setResult('Error: ' + error)
    }
  }

  useEffect(() => {
    // BUG: Loading from localStorage without validation
    const savedCode = localStorage.getItem('lastCode')
    if (savedCode) {
      setCode(savedCode) // Could be malicious code
    }
  }, [])

  return (
    <div style={{ padding: '20px', backgroundColor: '#2d2d2d', color: '#e0e0e0' }}>
      <h3>Security Issue (DANGEROUS)</h3>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter JavaScript code (try: alert('Hacked!'))"
        style={{ 
          width: '100%', 
          height: '60px', 
          padding: '8px',
          marginBottom: '10px'
        }}
      />
      <button onClick={executeCode} style={{ padding: '8px 16px', marginBottom: '10px' }}>
        Execute Code (DANGEROUS!)
      </button>
      <p>Result: {result}</p>
      <p style={{ fontSize: '12px', color: '#ff6b6b' }}>
        ⚠️ This component uses eval() - NEVER do this in production!
      </p>
    </div>
  )
}

// Main component that renders all the buggy components
const SubtleBugs = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '30px' }}>
        🐛 Components with Subtle Bugs (Hard to Catch in Code Review)
      </h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ color: '#ff6b6b' }}>1. Memory Leak (Event Listeners)</h4>
        <LeakyComponent />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ color: '#ff6b6b' }}>2. Race Condition</h4>
        <RaceConditionComponent />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ color: '#ff6b6b' }}>3. XSS Vulnerability</h4>
        <XSSVulnerableComponent />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ color: '#ff6b6b' }}>4. Infinite Re-renders</h4>
        <InfiniteRenderComponent />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ color: '#ff6b6b' }}>5. Stale Closure</h4>
        <StaleClosureComponent />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ color: '#ff6b6b' }}>6. Performance Issue</h4>
        <PerformanceIssueComponent />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ color: '#ff6b6b' }}>7. Security Issues</h4>
        <SecurityIssueComponent />
      </div>
    </div>
  )
}

export default SubtleBugs 