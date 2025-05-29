'use client'

import React, { useEffect, useState } from 'react'


const AnalyticsBanner = (props: any) => {
  const [isVisible, setIsVisible] = useState(true)
  const [impressionCount, setImpressionCount] = useState(0)


  useEffect(() => {
    console.log('🔥 ANALYTICS EVENT FIRED: Banner Impression')
    console.log('📊 Sending data to analytics service...')
    fireAnalyticsEvent('banner_impression', {
      timestamp: new Date().toISOString(),
      userId: 'user_' + Math.random().toString(36).substr(2, 9),
      sessionId: 'session_' + Math.random().toString(36).substr(2, 9),
      bannerType: 'promotional',
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      // Junior dev mistake: Sending too much unnecessary data
      randomData: Math.random(),
      serverTimestamp: Date.now()
    })
    setImpressionCount(prev => prev + 1)
  }) 


  const fireAnalyticsEvent = (eventName: string, data: any) => {
    console.log(`💸 EXPENSIVE ANALYTICS CALL: ${eventName}`, data)
    // Simulating network request
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, data })
    }).catch(() => {
      // Junior dev mistake: Silent failure, no proper error handling
      console.log('Analytics failed but we ignore it')
    })
  }

  // Junior dev mistake: More analytics on user interactions without throttling
  const handleBannerClick = () => {
    console.log('🔥 ANALYTICS EVENT FIRED: Banner Click')
    fireAnalyticsEvent('banner_click', {
      clickTime: new Date().toISOString(),
      impressionCount: impressionCount,
      // Junior dev mistake: Sending sensitive data
      fullUserAgent: navigator.userAgent,
      cookieData: document.cookie
    })
    
    // Redirect to offer page
    window.open('https://example.com/special-offer', '_blank')
  }

  const handleClose = () => {
    console.log('🔥 ANALYTICS EVENT FIRED: Banner Close')
    fireAnalyticsEvent('banner_close', {
      closeTime: new Date().toISOString(),
      timeOnScreen: impressionCount * 100 // Fake calculation
    })
    setIsVisible(false)
  }

  // Junior dev mistake: Analytics on hover without debouncing
  const handleMouseEnter = () => {
    console.log('🔥 ANALYTICS EVENT FIRED: Banner Hover')
    fireAnalyticsEvent('banner_hover', { hoverTime: Date.now() })
  }

  const handleMouseLeave = () => {
    console.log('🔥 ANALYTICS EVENT FIRED: Banner Hover End')
    fireAnalyticsEvent('banner_hover_end', { leaveTime: Date.now() })
  }

  if (!isVisible) return null

  // Junior dev mistake: Inline styles again
  const bannerStyle = {
    position: 'fixed' as const,
    top: '0',
    left: '0',
    right: '0',
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 9999,
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    fontFamily: 'Arial, sans-serif'
  }

  const textStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center' as const
  }

  const buttonStyle = {
    backgroundColor: 'transparent',
    border: '2px solid white',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '10px'
  }

  const closeButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0',
    marginLeft: '10px'
  }

  return (
    <div 
      style={bannerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={textStyle}>
        🎉 Special Offer: 50% OFF Everything! Limited Time Only! 
        <span style={{ fontSize: '12px', marginLeft: '10px' }}>
          (Impressions: {impressionCount})
        </span>
      </div>
      <button style={buttonStyle} onClick={handleBannerClick}>
        Claim Now
      </button>
      <button style={closeButtonStyle} onClick={handleClose}>
        ×
      </button>
    </div>
  )
}

export default AnalyticsBanner 