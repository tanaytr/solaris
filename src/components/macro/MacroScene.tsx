import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Line, Sphere, Box, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore, type DayState } from '../../store/useSimStore'
import { gridFragmentShader, gridVertexShader, lineFlowFragmentShader, lineFlowVertexShader } from '../../shaders'

// Ground grid
function GridGround() {
  const matRef = useRef<THREE.ShaderMaterial>(null!)
    const { weatherIntensity, theme } = useSimStore()
  
  const colors = theme === 'dark' 
    ? { c1: new THREE.Color(0.0, 0.2, 0.15), c2: new THREE.Color(0.0, 0.6, 0.4) }
    : { c1: new THREE.Color(0.8, 0.9, 1.0), c2: new THREE.Color(0.4, 0.6, 0.8) }

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[80, 80, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={gridVertexShader}
        fragmentShader={gridFragmentShader}
        uniforms={{ 
            uTime: { value: 0 },
            uColor1: { value: colors.c1 },
            uColor2: { value: colors.c2 }
        }}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

// Optimized Instanced Packets with Curve Caching
function EnergyPackets({ nodes }: { nodes: any[] }) {
  const { packets } = useSimStore()
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const tempObj = useMemo(() => new THREE.Object3D(), [])
  const tempColor = useMemo(() => new THREE.Color(), [])

  // Cache curves between all connected nodes to avoid GC pressure in useFrame
  const curveCache = useMemo(() => {
    const cache: Record<string, THREE.QuadraticBezierCurve3> = {}
    nodes.forEach(n1 => {
        nodes.forEach(n2 => {
            if (n1.id === n2.id) return
            const from = new THREE.Vector3(...n1.position).setY(0.5)
            const to = new THREE.Vector3(...n2.position).setY(0.5)
            const mid = from.clone().lerp(to, 0.5)
            mid.y += 4
            cache[`${n1.id}-${n2.id}`] = new THREE.QuadraticBezierCurve3(from, mid, to)
        })
    })
    return cache
  }, [nodes])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const elapsedTime = clock.elapsedTime

    packets.forEach((pkt, i) => {
      const curve = curveCache[`${pkt.fromId}-${pkt.toId}`]
      if (!curve) return

      const progress = Math.min(1, (elapsedTime - pkt.startTime) / pkt.duration)
      const pos = curve.getPoint(progress)
      
      tempObj.position.copy(pos)
      const scale = progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1
      tempObj.scale.setScalar(0.4 * scale)
      tempObj.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObj.matrix)
      
      tempColor.set(pkt.color)
      meshRef.current.setColorAt(i, tempColor)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
    meshRef.current.count = packets.length
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 100]} frustumCulled={false}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial transparent opacity={0.8} />
    </instancedMesh>
  )
}

function SelectionRing({ active }: { active: boolean }) {
    const ringRef = useRef<THREE.Mesh>(null!)
    useFrame(({ clock }) => {
        if (ringRef.current && active) {
            ringRef.current.rotation.z = clock.elapsedTime * 2
            ringRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 4) * 0.05)
        }
    })
    if (!active) return null
    return (
        <mesh ref={ringRef} rotation={[-Math.PI/2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[2.2, 2.4, 32]} />
            <meshBasicMaterial color="#00ffaa" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
    )
}

// Enhanced Connection lines with flow shader
function GridLines({ nodes }: { nodes: any[] }) {
  const connections: [string, string][] = [
    ['sf1', 'bat1'], ['sf2', 'bat1'], ['w1', 'bat1'],
    ['bat1', 'mp'], ['bat1', 'h1'], ['bat1', 'h2'], ['bat1', 'h3'],
    ['mp', 'h1'], ['mp', 'h2'],
  ]

  return (
    <>
      {connections.map(([a, b]) => {
        const na = nodes.find(n => n.id === a)
        const nb = nodes.find(n => n.id === b)
        if (!na || !nb) return null
        const pa = new THREE.Vector3(...na.position)
        const pb = new THREE.Vector3(...nb.position)
        pa.y = 0.1; pb.y = 0.1

        const { theme } = useSimStore()
        const lineColor = theme === 'dark' ? "#0a4030" : "#cbd5e1"
        const flowColor = theme === 'dark' ? "#00ffaa" : "#f59e0b"

        return (
          <group key={`${a}-${b}`}>
            <Line
              points={[pa, pb]}
              color={lineColor}
              lineWidth={1}
              transparent
              opacity={0.3}
            />
            {/* Animated flow line */}
            <mesh position={[0, 0, 0]}>
              <tubeGeometry args={[new THREE.LineCurve3(pa, pb), 1, 0.03, 8, false]} />
              <shaderMaterial
                vertexShader={lineFlowVertexShader}
                fragmentShader={lineFlowFragmentShader}
                uniforms={{
                  uTime: { value: 0 },
                  uColor: { value: new THREE.Color(flowColor) },
                  uSpeed: { value: 2.0 }
                }}
                transparent
                depthWrite={false}
              />
            </mesh>
          </group>
        )
      })}
    </>
  )
}

function NodeLevelBadge({ node }: { node: any }) {
  if (node.level <= 1) return null
  return (
    <group position={[0, 3.2, 0]}>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#00ffaa" />
      </mesh>
      <Text position={[0, 0.4, 0]} fontSize={0.25} color="#00ffaa" fontWeight="900" anchorX="center">
        LVL {node.level}
      </Text>
    </group>
  )
}

function EliteGlow({ level }: { level: number }) {
  if (level < 5) return null
  const glowRef = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime) * 0.1)
    }
  })
  return (
    <mesh ref={glowRef} position={[0, 0.2, 0]}>
      <sphereGeometry args={[4, 32, 32]} />
      <meshBasicMaterial color="#00ffaa" transparent opacity={0.03} side={THREE.BackSide} />
    </mesh>
  )
}

// Enhanced Solar Farm node
function SolarFarmNode({ node, onClick }: { node: any, onClick: () => void }) {
  const meshRef = useRef<THREE.Group>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const { selectedNodeId, theme } = useSimStore()
  const accentColor = theme === 'dark' ? '#00ffaa' : '#f59e0b'
  const labelColor = theme === 'dark' ? '#88ffcc' : '#1e293b'
  
  useFrame(({ clock }) => {
    if (glowRef.current) {
      const pulse = Math.sin(clock.elapsedTime * 2 + node.id.charCodeAt(2)) * 0.15 + 0.85
      glowRef.current.scale.setScalar(pulse)
    }
  })
  const healthColor = node.health > 0.9 ? '#00ffaa' : node.health > 0.7 ? '#ffaa00' : '#ff4444'
  const isSelected = selectedNodeId === node.id

  return (
    <group ref={meshRef} position={node.position} onClick={onClick}>
      <SelectionRing active={isSelected} />
      <NodeLevelBadge node={node} />
      <EliteGlow level={node.level} />
      {/* Base Structure */}
      <Box args={[3.8, 0.2, 2.8]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </Box>
      <Cylinder args={[0.05, 0.05, 0.4]} position={[1.5, 0.2, 1]}><meshStandardMaterial color="#888" /></Cylinder>
      <Cylinder args={[0.05, 0.05, 0.4]} position={[-1.5, 0.2, 1]}><meshStandardMaterial color="#888" /></Cylinder>
      
      {Array.from({ length: 3 }).map((_, i) =>
        Array.from({ length: 2 }).map((_, j) => (
          <group key={`${i}-${j}`} position={[-1 + i * 1.0, 0.45, -0.5 + j * 1.0]} rotation={[-Math.PI / 6, 0, 0]}>
            <Box args={[0.9, 0.05, 0.75]}>
              <meshStandardMaterial
                color={node.active ? '#003366' : '#222'}
                emissive={node.active ? '#0088ff' : '#000'}
                emissiveIntensity={node.active ? 4 : 0}
                metalness={1} roughness={0}
              />
            </Box>
            {/* Grid lines on panels */}
            <Box args={[0.92, 0.01, 0.01]} position={[0, 0.03, 0]}><meshBasicMaterial color="#00ffff" opacity={0.3} transparent /></Box>
          </group>
        ))
      )}
      <mesh ref={glowRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={node.active ? healthColor : '#333'} transparent opacity={0.9} />
      </mesh>
      <Text position={[0, 2.2, 0]} fontSize={0.35} color={labelColor} anchorX="center">
        {node.label}
      </Text>
      <Text position={[0, 1.75, 0]} fontSize={0.28} color={accentColor} anchorX="center">
        {node.active ? `${Math.round(node.production)} kWh` : 'OFFLINE'}
      </Text>
    </group>
  )
}

// Wind Turbine node
function WindNode({ node, onClick }: { node: any, onClick: () => void }) {
  const { theme } = useSimStore()
  const accentColor = theme === 'dark' ? '#00ffaa' : '#f59e0b'
  const labelColor = theme === 'dark' ? '#88ffcc' : '#1e293b'
  const bladeRef = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (bladeRef.current && node.active) {
      bladeRef.current.rotation.z = clock.elapsedTime * 1.5
    }
  })
  return (
    <group position={node.position} onClick={onClick}>
      <NodeLevelBadge node={node} />
      <EliteGlow level={node.level} />
      <Cylinder args={[0.08, 0.12, 3, 8]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <group ref={bladeRef} position={[0, 3, 0]}>
        {[0, 120, 240].map((deg) => (
          <group key={deg} rotation={[0, 0, (deg * Math.PI) / 180]}>
            <Box args={[0.08, 1.4, 0.04]} position={[0, 0.7, 0]}>
              <meshStandardMaterial 
                color={node.active ? "#00ffaa" : "#444"} 
                emissive={node.active ? "#00ffaa" : "#000"}
                emissiveIntensity={node.active ? 2 : 0}
                metalness={0.5} roughness={0.5} 
              />
            </Box>
          </group>
        ))}
        <Sphere args={[0.18, 8, 8]}>
          <meshStandardMaterial color="#fff" metalness={0.8} emissive="#00ffaa" emissiveIntensity={node.active ? 1 : 0} />
        </Sphere>
      </group>
      <Text position={[0, 4.2, 0]} fontSize={0.35} color={labelColor} anchorX="center">{node.label}</Text>
      <Text position={[0, 3.7, 0]} fontSize={0.28} color={accentColor} anchorX="center">{Math.round(node.production)} kWh</Text>
    </group>
  )
}

// Battery node
function BatteryNode({ node, onClick }: { node: any, onClick: () => void }) {
  const { gridEnergy, theme } = useSimStore()
  const accentColor = theme === 'dark' ? '#00ffaa' : '#f59e0b'
  const labelColor = theme === 'dark' ? '#88ffcc' : '#1e293b'
  const chargeLevel = Math.min(1, gridEnergy / 2000)
  return (
    <group position={node.position} onClick={onClick}>
      <NodeLevelBadge node={node} />
      <EliteGlow level={node.level} />
      <Box args={[2, 1.5, 1.2]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#0c1f18" metalness={0.6} roughness={0.4} />
      </Box>
      <Box args={[1.6 * chargeLevel, 0.25, 0.9]} position={[-0.8 + 0.8 * chargeLevel, 0.4, 0.65]}>
        <meshBasicMaterial color={chargeLevel > 0.5 ? '#00ffaa' : '#ffaa00'} />
      </Box>
      <Text position={[0, 2, 0]} fontSize={0.35} color={labelColor} anchorX="center">{node.label}</Text>
      <Text position={[0, 1.55, 0]} fontSize={0.28} color={accentColor} anchorX="center">{Math.round(chargeLevel * 100)}% charged</Text>
    </group>
  )
}

// Marketplace node
function MarketplaceNode({ node, onClick }: { node: any, onClick: () => void }) {
  const { theme } = useSimStore()
  const ringRef = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = clock.elapsedTime * 0.8
      ringRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.3
    }
  })
  return (
    <group position={node.position} onClick={onClick}>
      <Box args={[2.2, 0.15, 2.2]} position={[0, 0.07, 0]}>
        <meshStandardMaterial color="#1a0a00" metalness={0.8} />
      </Box>
      <mesh ref={ringRef} position={[0, 1.5, 0]}>
        <torusGeometry args={[0.8, 0.06, 8, 32]} />
        <meshBasicMaterial color="#ff8800" />
      </mesh>
      <Sphere args={[0.4, 16, 16]} position={[0, 1.5, 0]}>
        <meshBasicMaterial color="#ff6600" transparent opacity={0.6} />
      </Sphere>
      <Text position={[0, 2.6, 0]} fontSize={0.35} color={theme === 'dark' ? '#ffaa44' : '#ea580c'} anchorX="center">{node.label}</Text>
      <Text position={[0, 2.15, 0]} fontSize={0.28} color={theme === 'dark' ? '#ff8800' : '#8b4513'} anchorX="center">LIVE TRADING</Text>
    </group>
  )
}

function Bubble({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  const pos = useMemo(() => [
    (Math.random() - 0.5) * 2,
    0.5 + Math.random() * 1.0,
    (Math.random() - 0.5) * 2
  ] as [number, number, number], [])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = pos[1] + Math.sin(clock.elapsedTime * 2 + index) * 0.2
      ref.current.scale.setScalar(0.1 + Math.sin(clock.elapsedTime * 4 + index) * 0.05)
    }
  })

  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#a0f080" transparent opacity={0.6} />
    </mesh>
  )
}

// Biogas Node component
function BiogasNode({ node, onClick }: { node: any, onClick: () => void }) {
  const bulbRef = useRef<THREE.Mesh>(null!)
  const { userNodeId, theme } = useSimStore()
  const isUser = node.id === userNodeId
  const labelColor = theme === 'dark' ? '#88ffcc' : '#1e293b'

  useFrame(({ clock }) => {
    if (bulbRef.current) {
        bulbRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.1)
    }
  })

  return (
    <group position={node.position} onClick={onClick}>
      <SelectionRing active={isUser} />
      <NodeLevelBadge node={node} />
      <EliteGlow level={node.level} />
      <Cylinder args={[1.5, 1.8, 0.6, 32]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#2d3f20" metalness={0.6} roughness={0.4} />
      </Cylinder>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4ade80" transparent opacity={0.4} metalness={0.8} roughness={0.1} />
      </mesh>
      
      {/* Bubbling Particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Bubble key={i} index={i} />
      ))}
      
      <mesh ref={bulbRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#a0f080" />
      </mesh>
      <Text position={[0, 2.6, 0]} fontSize={0.35} color={isUser ? (theme === 'dark' ? "#ffcc00" : "#d97706") : labelColor} anchorX="center">
        {isUser ? `⭐ ${node.label.toUpperCase()}` : node.label}
      </Text>
      <Text position={[0, 2.15, 0]} fontSize={0.25} color="#4ade80" anchorX="center">{Math.round(node.production)} kWh</Text>
    </group>
  )
}

// Enhanced House node with Night Windows
function HouseNode({ node, onClick }: { node: any, onClick: () => void }) {
  const { dayState, selectedNodeId, theme } = useSimStore()
  const labelColor = theme === 'dark' ? '#88ffcc' : '#1e293b'
  const isNight = dayState === 'NIGHT'
  const isSelected = selectedNodeId === node.id

  return (
    <group position={node.position} onClick={onClick}>
      <SelectionRing active={isSelected} />
      <NodeLevelBadge node={node} />
      <EliteGlow level={node.level} />
      {/* Main Body */}
      <Box args={[1.6, 1.2, 1.4]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </Box>
      {/* Roof */}
      <mesh position={[0, 1.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0, 1.3, 0.8, 4]} />
        <meshStandardMaterial color="#050505" metalness={0.8} />
      </mesh>
      {/* Windows */}
      {[[-0.4, 0.7, 0.71], [0.4, 0.7, 0.71], [-0.4, 0.7, -0.71], [0.4, 0.7, -0.71]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
            <planeGeometry args={[0.3, 0.4]} />
            <meshBasicMaterial 
                color={isNight ? '#ffcc00' : '#111'} 
                transparent 
                opacity={isNight ? 0.9 : 0.3} 
            />
        </mesh>
      ))}
      {isNight && <pointLight color="#ffaa00" intensity={1.5} distance={4} position={[0, 0.7, 0]} />}
      <Text position={[0, 2.4, 0]} fontSize={0.3} color={labelColor} anchorX="center">{node.label}</Text>
      <Text position={[0, 2.0, 0]} fontSize={0.25} color="#cc4444" anchorX="center">{Math.abs(node.production)} kWh consumed</Text>
    </group>
  )
}

import { WeatherLayer } from './WeatherLayer'

export function MacroScene() {
  const { nodes, setZoomLevel, selectNode, tick, timeOfDay, theme } = useSimStore()
  
  // Day/Night lighting logic
  const solarFactor = Math.max(0, Math.sin((timeOfDay - 6) / 12 * Math.PI))
  
  const skyColor = theme === 'dark'
    ? new THREE.Color().setHSL(0.5, 0.5, 0.05 + 0.1 * solarFactor)
    : new THREE.Color('#f8fafc')
    
  const sunIntensity = 0.2 + 0.8 * solarFactor
  const accentColor = theme === 'dark' ? '#00ffaa' : '#f59e0b'
  const secondaryAccent = theme === 'dark' ? '#0ea5e9' : '#ea580c'
  const labelColor = theme === 'dark' ? '#88ffcc' : '#1e293b'

  useFrame(({ clock }, delta) => tick(delta, clock.elapsedTime))

  const handleNodeClick = useCallback((node: any) => {
    selectNode(node.id)
    if (node.type === 'solar_farm' || node.type === 'battery') {
      setZoomLevel('meso')
    }
  }, [setZoomLevel, selectNode])

  return (
    <group>
      <GridGround />
      <GridLines nodes={nodes} />
      <WeatherLayer />

      {nodes.map(node => {
        const props = { key: node.id, node, onClick: () => handleNodeClick(node) }
        if (node.type === 'solar_farm') return <SolarFarmNode {...props} />
        if (node.type === 'wind') return <WindNode {...props} />
        if (node.type === 'battery') return <BatteryNode {...props} />
        if (node.type === 'marketplace') return <MarketplaceNode {...props} />
        if (node.type === 'house') return <HouseNode {...props} />
        if (node.type === 'biogas') return <BiogasNode {...props} />
        return null
      })}

      <EnergyPackets nodes={nodes} />

      <fog attach="fog" args={[skyColor.getStyle(), 30, 80]} />
      <ambientLight intensity={theme === 'dark' ? (0.4 + 0.3 * solarFactor) : 0.8} color={theme === 'dark' ? "#b3ffe0" : "#fff"} />
      <directionalLight 
        position={[20, 30 * solarFactor, 10]} 
        intensity={ sunIntensity * (theme === 'dark' ? 1.5 : 1.0) } 
        color={theme === 'dark' ? "#fff4cc" : "#fff"} 
        castShadow 
      />
      <pointLight position={[0, 10, 0]} intensity={1.5 * (1 - solarFactor)} color={accentColor} distance={50} />
      <pointLight position={[2, 5, 14]} intensity={2 * (1 - solarFactor * 0.5)} color={secondaryAccent} distance={15} />
    </group>
  )
}

