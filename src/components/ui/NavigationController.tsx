import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

export function NavigationController() {
  const { zoomLevel, setZoomLevel, selectedNodeId, nodes } = useSimStore()
  const controlsRef = useRef<CameraControls>(null!)
  const { camera } = useThree()

  const lastTransitionTime = useRef(0)
  const transitionLockout = 1000 // ms

  // Handle Level Transitions
  useEffect(() => {
    if (!controlsRef.current) return
    lastTransitionTime.current = performance.now()

    if (zoomLevel === 'macro') {
      controlsRef.current.setLookAt(0, 20, 30, 0, 0, 0, true)
    } else if (zoomLevel === 'meso') {
      // Meso scene is localized at origin
      controlsRef.current.setLookAt(0, 8, 12, 0, 0, 0, true)
    } else if (zoomLevel === 'atomic') {
      // Atomic scene is localized at origin
      controlsRef.current.setLookAt(0, 5, 8, 0, 0, 0, true)
    }
  }, [zoomLevel, selectedNodeId])

  // Scroll-to-Zoom Logic
  useFrame(() => {
    if (!controlsRef.current) return
    
    // Lockout auto-zoom during manual transitions
    if (performance.now() - lastTransitionTime.current < transitionLockout) return

    const dist = controlsRef.current.distance
    
    // Macro -> Meso
    if (zoomLevel === 'macro' && dist < 12) {
      setZoomLevel('meso')
    }
    // Meso -> Macro
    if (zoomLevel === 'meso' && dist > 30) {
      setZoomLevel('macro')
    }
    // Meso -> Atomic
    if (zoomLevel === 'meso' && dist < 5) {
      setZoomLevel('atomic')
    }
    // Atomic -> Meso
    if (zoomLevel === 'atomic' && dist > 15) {
      setZoomLevel('meso')
    }
  })

  return (
    <CameraControls 
      ref={controlsRef} 
      makeDefault 
      minDistance={1}
      maxDistance={80}
      dollySpeed={0.5}
      smoothTime={0.3}
    />
  )
}
