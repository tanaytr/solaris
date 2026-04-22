import React, { useState, useEffect } from 'react'
import { useSimStore } from '../../store/useSimStore'
import { getSlides } from '../../data/slides'
import './PresentationEngine.css'

export const PresentationEngine: React.FC = () => {
  const setCurrentView = useSimStore(s => s.setCurrentView)
  const gridEnergy = useSimStore(s => s.gridEnergy)
  const co2Offset = useSimStore(s => s.co2Offset)
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [subStep, setSubStep] = useState(0)
  const [animating, setAnimating] = useState(false)

  // Memoize slides to prevent re-creation on stats change, 
  // though getSlides is relatively light, it's better to be safe.
  const slides = getSlides({ gridEnergy, co2Offset })

  const nextSlide = () => {
    const currentMaxSubSteps = slides[currentSlide].maxSubSteps || 0
    if (subStep < currentMaxSubSteps) {
      setSubStep(subStep + 1)
      return
    }

    if (currentSlide < slides.length - 1) {
      setAnimating(true)
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1)
        setSubStep(0)
        setAnimating(false)
      }, 400)
    }
  }

  const prevSlide = () => {
    if (subStep > 0) {
      setSubStep(s => s - 1)
      return
    }

    if (currentSlide > 0) {
      setAnimating(true)
      setTimeout(() => {
        const prevSlideIdx = currentSlide - 1
        const prevMax = slides[prevSlideIdx].maxSubSteps || 0
        setCurrentSlide(prevSlideIdx)
        setSubStep(prevMax)
        setAnimating(false)
      }, 400)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, subStep])

  return (
    <div className="presentation-container">
      {/* Header HUD */}
      <header className="pres-header" style={{ pointerEvents: 'all' }}>
        <button onClick={() => setCurrentView('landing')} className="back-btn">Exit</button>
        <div className="system-id">Solaris Technical Overview</div>
        <div className="node-track">Stage {currentSlide + 1} of {slides.length}</div>
      </header>

      {/* Main Content */}
      <main className={`pres-main ${animating ? 'exit' : 'enter'} ${slides[currentSlide].isPitch ? 'pitch-mode' : ''}`} style={{ pointerEvents: 'all' }}>
        <div className="slide-content-wrap">
          <div className="slide-title-group" style={{ textAlign: 'left', width: '100%' }}>
            <h2 className="slide-title" style={{ 
              textTransform: 'none', 
              fontSize: '3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'none',
              WebkitTextFillColor: 'var(--text-main)'
            }}>
              <span style={{ color: 'var(--accent-primary)', opacity: 0.8 }}>{(currentSlide + 1).toString().padStart(2, '0')}</span>
              <span style={{ opacity: 0.3 }}>|</span>
              {slides[currentSlide].title}
            </h2>
            <div className="ppt-header-line" />
            <span className="slide-subtitle" style={{ display: 'block', marginTop: '1rem', opacity: 0.5, letterSpacing: 2, fontWeight: 700 }}>
              {slides[currentSlide].subtitle.toUpperCase()}
            </span>
          </div>
          <div className="slide-body" style={{ marginTop: '3rem', width: '100%' }}>
            {slides[currentSlide].content(subStep)}
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="pres-footer" style={{ pointerEvents: 'all' }}>
        <button 
          onClick={prevSlide} 
          disabled={currentSlide === 0 && subStep === 0} 
          className={`nav-btn ${(currentSlide === 0 && subStep === 0) ? 'disabled' : ''}`}
        >
          Previous
        </button>
        <div className="interaction-hint">Use arrow keys to navigate</div>
        <button 
          onClick={nextSlide} 
          disabled={currentSlide === slides.length - 1 && subStep === (slides[currentSlide].maxSubSteps || 0)} 
          className="nav-btn primary"
        >
          { (subStep < (slides[currentSlide].maxSubSteps || 0)) ? "Continue" : "Next" }
        </button>
      </footer>
    </div>
  )
}
