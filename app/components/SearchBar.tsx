'use client'

import React, { useState, useEffect } from 'react'

interface SearchResult {
  id: string
  title: string
  description: string
  url: string
}

interface SearchBarProps {
  onSearch: (results: SearchResult[]) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search products..." }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchCount, setSearchCount] = useState(0)

  // Hidden Bug #1: Stale closure in interval
  useEffect(() => {
    const interval = setInterval(() => {
      // BUG: This captures the initial searchCount value (0)
      console.log('Search analytics:', searchCount) // Always logs 0
      
      // Send analytics with stale data
      if (typeof window !== 'undefined') {
        localStorage.setItem('searchAnalytics', JSON.stringify({
          totalSearches: searchCount, // Always 0
          lastUpdate: Date.now()
        }))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, []) // BUG: Empty dependency array captures stale searchCount

  // Hidden Bug #2: Race condition in search
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setSearchCount(searchCount + 1) // BUG: Using stale state

    try {
      // BUG: No request cancellation - rapid typing causes race conditions
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      
      // BUG: Later requests might resolve before earlier ones
      setResults(data.results || [])
      onSearch(data.results || [])
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Hidden Bug #3: No debouncing - fires on every keystroke
  useEffect(() => {
    if (query) {
      performSearch(query) // BUG: Immediate search on every character
    } else {
      setResults([])
      onSearch([])
    }
  }, [query]) // Fires on every character change

  // Hidden Bug #4: XSS vulnerability in search suggestions
  const renderSuggestion = (result: SearchResult) => {
    // BUG: Directly rendering user-generated content
    return (
      <div 
        key={result.id}
        className="p-2 hover:bg-gray-700 cursor-pointer border-b border-gray-600"
        onClick={() => {
          setQuery(result.title)
          // BUG: Executing potentially malicious code
          if (result.url.startsWith('javascript:')) {
            eval(result.url.substring(11)) // EXTREMELY DANGEROUS!
          } else {
            window.open(result.url, '_blank')
          }
        }}
      >
        <div 
          className="font-medium text-white"
          dangerouslySetInnerHTML={{ __html: result.title }} // BUG: XSS vulnerability
        />
        <div 
          className="text-sm text-gray-400"
          dangerouslySetInnerHTML={{ __html: result.description }} // BUG: XSS vulnerability
        />
      </div>
    )
  }

  // Hidden Bug #5: Memory leak with global event listener
  useEffect(() => {
    const handleGlobalClick = () => {
      // Track clicks for "user behavior analytics"
      const clickData = {
        timestamp: Date.now(),
        currentQuery: query,
        resultCount: results.length
      }
      
      // BUG: Storing potentially large amounts of data
      const existingData = localStorage.getItem('clickAnalytics') || '[]'
      const analytics = JSON.parse(existingData)
      analytics.push(clickData)
      localStorage.setItem('clickAnalytics', JSON.stringify(analytics))
    }

    // BUG: Adding global listener but never removing it
    document.addEventListener('click', handleGlobalClick)
    
    // Missing cleanup function
    // return () => document.removeEventListener('click', handleGlobalClick)
  }, [query, results]) // BUG: Effect runs on every query/results change

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map(renderSuggestion)}
        </div>
      )}

      {query && (
        <div className="text-xs text-gray-500 mt-1">
          Searches: {searchCount} | Results: {results.length}
        </div>
      )}
    </div>
  )
}

export default SearchBar 