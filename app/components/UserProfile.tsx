'use client'

import React, { useState, useEffect } from 'react'

// Junior dev mistake: Not using TypeScript properly, any types everywhere
const UserProfile = (props: any) => {
  // Junior dev mistake: Too many useState hooks instead of using a single object
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [tempName, setTempName] = useState('')
  const [tempEmail, setTempEmail] = useState('')
  const [tempAge, setTempAge] = useState(0)

  // Junior dev mistake: useEffect without proper dependencies
  useEffect(() => {
    // Simulating data fetch
    setName('John Doe')
    setEmail('john@example.com')
    setAge(25)
  }, [])

  // Junior dev mistake: Overly complex validation logic
  const validateForm = () => {
    let errorMessage = ''
    
    if (tempName === '') {
      errorMessage = 'Name is required'
      setErrors(errorMessage)
      return false
    } else if (tempName.length < 2) {
      errorMessage = 'Name must be at least 2 characters'
      setErrors(errorMessage)
      return false
    } else if (tempName.length > 50) {
      errorMessage = 'Name is too long'
      setErrors(errorMessage)
      return false
    }
    
    if (tempEmail === '') {
      errorMessage = 'Email is required'
      setErrors(errorMessage)
      return false
    } else if (!tempEmail.includes('@')) {
      errorMessage = 'Email must contain @'
      setErrors(errorMessage)
      return false
    } else if (!tempEmail.includes('.')) {
      errorMessage = 'Email must contain .'
      setErrors(errorMessage)
      return false
    }
    
    if (tempAge < 0) {
      errorMessage = 'Age cannot be negative'
      setErrors(errorMessage)
      return false
    } else if (tempAge > 150) {
      errorMessage = 'Age seems unrealistic'
      setErrors(errorMessage)
      return false
    }
    
    setErrors('')
    return true
  }

  // Junior dev mistake: Not extracting reusable functions
  const handleEdit = () => {
    setIsEditing(true)
    setTempName(name)
    setTempEmail(email)
    setTempAge(age)
    setShowModal(true)
  }

  const handleSave = () => {
    setLoading(true)
    
    // Junior dev mistake: Simulating async operation with setTimeout instead of proper async/await
    setTimeout(() => {
      if (validateForm()) {
        setName(tempName)
        setEmail(tempEmail)
        setAge(tempAge)
        setIsEditing(false)
        setShowModal(false)
        setLoading(false)
        alert('Profile updated successfully!') // Junior dev mistake: Using alert instead of proper notifications
      } else {
        setLoading(false)
      }
    }, 1000)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setShowModal(false)
    setErrors('')
    setTempName('')
    setTempEmail('')
    setTempAge(0)
  }

  // Junior dev mistake: Inline styles everywhere instead of CSS classes
  const containerStyle = {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #444',
    borderRadius: '8px',
    backgroundColor: '#1a1a1a',
    fontFamily: 'Arial, sans-serif',
    color: '#e0e0e0'
  }

  const headerStyle = {
    color: '#ffffff',
    textAlign: 'center' as const,
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold'
  }

  const fieldStyle = {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#2d2d2d',
    border: '1px solid #555',
    borderRadius: '4px',
    color: '#e0e0e0'
  }

  const buttonStyle = {
    padding: '10px 20px',
    margin: '5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#0d6efd',
    color: 'white'
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white'
  }

  const modalStyle = {
    position: 'fixed' as const,
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: showModal ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }

  const modalContentStyle = {
    backgroundColor: '#1a1a1a',
    padding: '30px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
    border: '1px solid #444',
    color: '#e0e0e0'
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>User Profile</h2>
      
      <div style={fieldStyle}>
        <strong>Name:</strong> {name}
      </div>
      
      <div style={fieldStyle}>
        <strong>Email:</strong> {email}
      </div>
      
      <div style={fieldStyle}>
        <strong>Age:</strong> {age} years old
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          style={primaryButtonStyle}
          onClick={handleEdit}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Edit Profile'}
        </button>
      </div>

      {/* Junior dev mistake: Modal logic mixed with main component instead of separate component */}
      <div style={modalStyle}>
        <div style={modalContentStyle}>
          <h3 style={{ marginBottom: '20px', color: '#ffffff' }}>Edit Profile</h3>
          
          {errors && (
            <div style={{ 
              color: '#ff6b6b', 
              marginBottom: '15px', 
              padding: '10px', 
              backgroundColor: '#2d1b1b',
              border: '1px solid #ff6b6b',
              borderRadius: '4px'
            }}>
              {errors}
            </div>
          )}
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e0e0e0' }}>
              Name:
            </label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #555',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#2d2d2d',
                color: '#e0e0e0'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e0e0e0' }}>
              Email:
            </label>
            <input
              type="email"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #555',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#2d2d2d',
                color: '#e0e0e0'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e0e0e0' }}>
              Age:
            </label>
            <input
              type="number"
              value={tempAge}
              onChange={(e) => setTempAge(parseInt(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #555',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#2d2d2d',
                color: '#e0e0e0'
              }}
            />
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <button 
              style={primaryButtonStyle}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              style={secondaryButtonStyle}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile 