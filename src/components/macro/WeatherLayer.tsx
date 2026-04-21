import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cloud, Clouds } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

export function WeatherLayer() {
  const { weatherIntensity, timeOfDay } = useSimStore()
  const groupRef = useRef<THREE.Group>(null!)
  
  const solarFactor = Math.max(0, Math.sin((timeOfDay - 6) / 12 * Math.PI))
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  // Hide or fade clouds based on intensity
  if (weatherIntensity < 0.2) return null

  return (
    <group ref={groupRef}>
      <Clouds material={THREE.MeshStandardMaterial}>
        <Cloud 
          seed={1}
          segments={40} 
          bounds={[40, 5, 40]} 
          volume={20} 
          color={new THREE.Color(0.2, 0.4, 0.5).lerp(new THREE.Color(0.1, 0.1, 0.15), weatherIntensity)}
          opacity={0.3 * weatherIntensity}
          position={[0, 15, 0]}
          speed={0.2}
        />
        <Cloud 
          seed={2}
          segments={40} 
          bounds={[40, 5, 40]} 
          volume={20} 
          color={new THREE.Color(0.2, 0.4, 0.5).lerp(new THREE.Color(0.1, 0.1, 0.15), weatherIntensity)}
          opacity={0.2 * weatherIntensity}
          position={[10, 18, -10]}
          speed={0.3}
        />
      </Clouds>
    </group>
  )
}
