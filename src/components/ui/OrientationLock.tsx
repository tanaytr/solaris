import React, { useState, useEffect } from 'react'

export const OrientationLock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      // Check if height is significantly greater than width (to avoid false positives on square-ish windows)
      setIsPortrait(window.innerHeight > window.innerWidth * 1.2)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    return () => window.removeEventListener('resize', checkOrientation)
  }, [])

  if (!isPortrait) return <>{children}</>

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000a06',
      color: '#00ffaa',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      fontFamily: "'Orbitron', sans-serif",
      textAlign: 'center',
      padding: '2rem'
    }}>
      {/* 3D Phone Rotation Animation */}
      <div style={{
        width: '60px',
        height: '100px',
        border: '3px solid #00ffaa',
        borderRadius: '8px',
        marginBottom: '2rem',
        position: 'relative',
        animation: 'rotatePhone 2s ease-in-out infinite'
      }}>
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '4px',
          background: '#00ffaa',
          borderRadius: '2px'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '10px',
          height: '10px',
          border: '2px solid #00ffaa',
          borderRadius: '50%'
        }} />
      </div>

      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', letterSpacing: '0.2rem' }}>
        LANDSCAPE MODE REQUIRED
      </h1>
      <p style={{ fontFamily: "'Space Mono', monospace", opacity: 0.7, maxWidth: '300px', lineHeight: '1.5' }}>
        Please rotate your device for the ultimate SOLARIS Digital Twin experience.
      </p>

      <style>{`
        @keyframes rotatePhone {
          0% { transform: rotate(0deg); }
          30% { transform: rotate(90deg); }
          70% { transform: rotate(90deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  )
}
