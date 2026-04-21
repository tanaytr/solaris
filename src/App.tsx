import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useSimStore } from './store/useSimStore'
import { MacroScene } from './components/macro/MacroScene'
import { MesoScene } from './components/meso/MesoScene'
import { AtomicScene } from './components/atomic/AtomicScene'
import { HUD } from './components/ui/HUD'
import { LandingPage } from './components/ui/LandingPage'
import { PresentationEngine } from './components/ui/PresentationEngine'
import { MarketplaceEngine } from './components/ui/MarketplaceEngine'
import { PostProcessing } from './components/ui/PostProcessing'
import { NavigationController } from './components/ui/NavigationController'
import { OrientationLock } from './components/ui/OrientationLock'

function SceneContent() {
  const zoomLevel = useSimStore(s => s.zoomLevel)
  const currentView = useSimStore(s => s.currentView)

  return (
    <>
      {currentView === 'experience' && (
        <group>
          {zoomLevel === 'macro' && <MacroScene />}
          {zoomLevel === 'meso' && <MesoScene />}
          {zoomLevel === 'atomic' && <AtomicScene />}
        </group>
      )}
      
      <NavigationController />
      <PostProcessing />
      
      {/* Animated Intergalactic Background */}
      <group>
        <Stars 
          radius={300} 
          depth={60} 
          count={15000} 
          factor={7} 
          saturation={0.5} 
          fade 
          speed={1.5} 
        />
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={3} 
        />
      </group>
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="var(--accent-primary)" />
    </>
  )
}

function App() {
  const cameraConfig = { position: [0, 20, 28] as [number, number, number], fov: 55 }
  const currentView = useSimStore(s => s.currentView)
  const theme = useSimStore(s => s.theme)

  return (
    <OrientationLock>
      <div 
        className={`app-root theme-${theme}`}
        style={{ 
          width: '100vw', height: '100vh', 
          background: theme === 'dark' ? '#020408' : '#f8fafc', 
          overflow: 'hidden', 
          position: 'relative',
          transition: 'background 0.8s ease-in-out'
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700;900&family=Inter:wght@300;400;600;700&family=Space+Mono:wght@400;700&display=swap');
          
          :root {
            --bg-base: #020408;
            --text-main: #f1f5f9;
            --accent-primary: #00ffaa;
            --accent-secondary: #0ea5e9;
            --panel-bg: rgba(10, 15, 25, 0.85);
            --border-ui: rgba(255, 255, 255, 0.1);
            --nebula-glow: rgba(0, 255, 170, 0.08);
          }

          .theme-light {
            --bg-base: #f8fafc;
            --text-main: #0f172a;
            --accent-primary: #f59e0b;
            --accent-secondary: #ea580c;
            --panel-bg: rgba(255, 255, 255, 0.9);
            --border-ui: rgba(0, 0, 0, 0.08);
            --nebula-glow: rgba(245, 158, 11, 0.05);
          }

          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            background: var(--bg-base); 
            color: var(--text-main);
            font-family: 'Inter', sans-serif; 
            overflow: hidden;
          }
          
          h1, h2, h3, h4, .outfit { font-family: 'Outfit', sans-serif; }
          .mono { font-family: 'Space Mono', monospace; }

          input[type=range] { -webkit-appearance: none; height: 3px; border-radius: 2px; background: var(--border-ui); outline: none; }
          input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; cursor: pointer; background: var(--accent-primary); border: 2px solid #fff; box-shadow: 0 0 10px var(--accent-primary); }

          @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .nebula-spin { animation: rotate 120s linear infinite; }
        `}</style>

        {/* Global Canvas Backdrop */}
        <Canvas
          camera={cameraConfig}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          shadows
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <Suspense fallback={null}>
            <SceneContent />
          </Suspense>
        </Canvas>

        {/* Dynamic Moving Nebula Overlay */}
        <div 
          className="nebula-spin"
          style={{
            position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
            pointerEvents: 'none', zIndex: 1,
            background: `radial-gradient(circle at 50% 50%, var(--nebula-glow) 0%, transparent 50%),
                         radial-gradient(circle at 30% 70%, rgba(14, 165, 233, 0.05) 0%, transparent 40%)`,
            mixBlendMode: 'screen',
            opacity: theme === 'dark' ? 1 : 0.4
          }} 
        />

        {/* View Layers */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1000, pointerEvents: 'none' }}>
           {currentView === 'landing' && <div style={{ pointerEvents: 'all', width: '100%', height: '100%' }}><LandingPage /></div>}
           {currentView === 'experience' && <div style={{ width: '100%', height: '100%' }}><HUD /></div>}
           {currentView === 'presentation' && <div style={{ width: '100%', height: '100%' }}><PresentationEngine /></div>}
           {currentView === 'marketplace' && <div style={{ pointerEvents: 'all', width: '100%', height: '100%' }}><MarketplaceEngine /></div>}
        </div>

        {/* Vignette Overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
          opacity: theme === 'dark' ? 1 : 0.2
        }} />
        
        {/* Film Grain */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          opacity: 0.04,
          backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
          filter: theme === 'light' ? 'invert(1)' : 'none'
        }} />

        {/* Architectural Corners */}
        <div style={{ position: 'absolute', top: 40, left: 40, width: 40, height: 1, background: 'var(--border-ui)', pointerEvents: 'none', zIndex: 60 }} />
        <div style={{ position: 'absolute', top: 40, left: 40, width: 1, height: 40, background: 'var(--border-ui)', pointerEvents: 'none', zIndex: 60 }} />
        <div style={{ position: 'absolute', top: 40, right: 40, width: 40, height: 1, background: 'var(--border-ui)', pointerEvents: 'none', zIndex: 60 }} />
        <div style={{ position: 'absolute', top: 40, right: 40, width: 1, height: 40, background: 'var(--border-ui)', pointerEvents: 'none', zIndex: 60 }} />
      </div>
    </OrientationLock>
  )
}

export default App

