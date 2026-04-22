import { useEffect, useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

export function NavigationController() {
  const { camera, controls } = useThree() as any
  const { zoomLevel, selectedNodeId, nodes } = useSimStore()
  
  const targetPos = useRef(new THREE.Vector3(0, 20, 28))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const isMoving = useRef(false)

  const selectedNode = useMemo(() => 
    nodes.find(n => n.id === selectedNodeId), 
  [nodes, selectedNodeId])

  useEffect(() => {
    isMoving.current = true
    switch (zoomLevel) {
      case 'macro':
        targetPos.current.set(0, 20, 28)
        targetLookAt.current.set(0, 0, 0)
        break
      case 'meso':
        if (selectedNode) {
          const [x, y, z] = selectedNode.position
          targetPos.current.set(x + 10, y + 10, z + 10)
          targetLookAt.current.set(x, y, z)
        } else {
          targetPos.current.set(10, 10, 10)
          targetLookAt.current.set(0, 0, 0)
        }
        break
      case 'atomic':
        targetPos.current.set(0, 3, 6)
        targetLookAt.current.set(0, 1, 0)
        break
    }
  }, [zoomLevel, selectedNodeId])

  useFrame((state, delta) => {
    if (!controls || !isMoving.current) return

    // Smoothly lerp camera position
    camera.position.lerp(targetPos.current, delta * 3)
    
    // Smoothly lerp controls target (the lookAt point)
    controls.target.lerp(targetLookAt.current, delta * 3)
    controls.update()

    // Stop lerping when close enough to target
    if (camera.position.distanceTo(targetPos.current) < 0.1 && 
        controls.target.distanceTo(targetLookAt.current) < 0.1) {
      isMoving.current = false
    }
  })

  return null
}
