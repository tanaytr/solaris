import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
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
  const theme = useSimStore(s => s.theme)

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
      <OrbitControls 
        makeDefault 
        enablePan={true} 
        enableRotate={true}
        enableZoom={true}
        maxPolarAngle={Math.PI / 1.5}
        minDistance={2}
        maxDistance={100}
      />
      <PostProcessing />
      
      {/* Animated Intergalactic Background */}
      <group visible={theme === 'dark'}>
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
      
      <ambientLight intensity={theme === 'dark' ? 0.5 : 1.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={theme === 'dark' ? '#00ffaa' : '#f59e0b'} />
    </>
  )
}

function App() {
  const cameraConfig = { position: [0, 20, 28] as [number, number, number], fov: 55 }
  const currentView = useSimStore(s => s.currentView)
  const theme = useSimStore(s => s.theme)
  const marketplaceOpen = useSimStore(s => s.marketplaceOpen)

  return (
    <OrientationLock>
      <div className={`app-root theme-${theme}`}>
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
            background: theme === 'dark' 
              ? `radial-gradient(circle at 50% 50%, var(--nebula-glow) 0%, transparent 60%),
                 radial-gradient(circle at 30% 70%, rgba(14, 165, 233, 0.05) 0%, transparent 40%)`
              : `radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 70%)`,
            mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
            opacity: theme === 'dark' ? 1 : 0.4
          }} 
        />

        {/* View Layers */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1000, pointerEvents: 'none' }}>
           {currentView === 'landing' && <div style={{ pointerEvents: 'all', width: '100%', height: '100%' }}><LandingPage /></div>}
           {currentView === 'experience' && <div style={{ width: '100%', height: '100%' }}><HUD /></div>}
           {currentView === 'presentation' && <div style={{ pointerEvents: 'all', width: '100%', height: '100%' }}><PresentationEngine /></div>}
        </div>

        {/* Global Marketplace Overlay */}
        {marketplaceOpen && currentView === 'experience' && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 2000, pointerEvents: 'all' }}>
            <MarketplaceEngine />
          </div>
        )}

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

