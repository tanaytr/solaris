import React from 'react'
import { useSimStore } from '../../store/useSimStore'

export const LandingPage: React.FC = () => {
  const { setCurrentView, theme } = useSimStore()
  const [hovered, setHovered] = React.useState(false)

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'var(--bg-base)',
      color: 'var(--text-main)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
      transition: 'background 0.5s ease'
    }}>
      {/* Background Data Rain (Subtle) */}
      <style>{`
        @keyframes rain {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.15; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .rain-drop {
          position: absolute; color: var(--accent-primary); font-family: 'Space Mono', monospace;
          font-size: 11px; pointer-events: none; opacity: 0;
          animation: rain 4s linear infinite;
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.01); }
        }
        .breathe { animation: breathe 5s ease-in-out infinite; }
      `}</style>

      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i} className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        >
          {Math.random() > 0.5 ? '1' : '0'}
        </div>
      ))}

      {/* Center Backdrop Glow */}
      <div style={{
        position: 'absolute', width: '800px', height: '800px',
        background: 'radial-gradient(circle, var(--nebula-glow) 0%, transparent 70%)',
        zIndex: 0, opacity: 0.5, pointerEvents: 'none'
      }} />

      {/* Main Content */}
      <div style={{ zIndex: 10, textAlign: 'center', maxWidth: 900, padding: '0 2rem' }}>
        <div className="outfit" style={{
          fontSize: '0.75rem', letterSpacing: '8px', opacity: 0.4, marginBottom: '2rem',
          textTransform: 'uppercase', fontWeight: 700
        }}>
          Autonomous Grid Management
        </div>

        <h1 className="breathe outfit" style={{
          fontSize: 'clamp(4rem, 15vw, 9rem)', fontWeight: 900, letterSpacing: '-6px',
          lineHeight: 0.85, marginBottom: '2.5rem',
          background: 'linear-gradient(to bottom, var(--text-main) 40%, var(--accent-primary) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))'
        }}>
          ENEREX
        </h1>

        <p className="outfit" style={{
          fontSize: '1.25rem', maxWidth: 650, margin: '0 auto 5rem',
          lineHeight: '1.7', opacity: 0.6, fontWeight: 300
        }}>
          Bridging the physical and transactional layers of renewable energy. High-frequency telemetry meets decentralized P2P liquidity.
        </p>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentView('experience')}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              padding: '1.4rem 3.5rem',
              fontSize: '1.1rem',
              background: 'var(--text-main)',
              color: 'var(--bg-base)',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 900,
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: hovered ? '0 25px 50px rgba(0,0,0,0.3)' : '0 10px 20px rgba(0,0,0,0.1)',
              transform: hovered ? 'translateY(-8px) scale(1.05)' : 'none'
            }}
          >
            Enter EXPERIENCE
          </button>

          <button
            onClick={() => setCurrentView('presentation')}
            style={{
              padding: '1.4rem 3.5rem',
              fontSize: '1.1rem',
              background: 'var(--panel-bg)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-ui)',
              borderRadius: '20px',
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.background = 'var(--panel-bg)'
            }}
          >
            Technical SLIDES
          </button>
        </div>
      </div>

      {/* Global Architectural Corners */}
      <div style={{ position: 'absolute', top: 60, left: 60, width: 60, height: 1, background: 'var(--border-ui)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: 60, left: 60, width: 1, height: 60, background: 'var(--border-ui)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: 60, right: 60, width: 60, height: 1, background: 'var(--border-ui)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: 60, right: 60, width: 1, height: 60, background: 'var(--border-ui)', opacity: 0.5 }} />
    </div>
  )
}
