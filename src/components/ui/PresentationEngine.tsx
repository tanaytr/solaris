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
      <main className={`pres-main ${animating ? 'exit' : 'enter'}`} style={{ pointerEvents: 'all' }}>
        <div className="slide-content-wrap">
          <h2 className="slide-title" style={{ textTransform: 'capitalize' }}>{slides[currentSlide].title.toLowerCase()}</h2>
          <span className="slide-subtitle">{slides[currentSlide].subtitle}</span>
          <div className="slide-body">
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
