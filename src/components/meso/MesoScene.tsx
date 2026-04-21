import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Box, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'
import { electronVertexShader, electronFragmentShader } from '../../shaders'

// Optimized Panel array with Instanced Cells
function PanelArray({ tilt, soiling, active }: { tilt: number, soiling: number, active: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const tempObj = useMemo(() => new THREE.Object3D(), [])
  const tempColor = useMemo(() => new THREE.Color(), [])

  const cells = useMemo(() => {
    const arr = []
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 8; c++) {
        arr.push({ x: -1.05 + c * 0.31, z: -0.75 + r * 0.31 })
      }
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const dirtFactor = 1 - soiling
    const baseColor = new THREE.Color(0, 0.05 * dirtFactor, 0.15 * dirtFactor)
    
    cells.forEach((c, i) => {
      tempObj.position.set(c.x, 0.025, c.z)
      tempObj.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObj.matrix)
      
      if (active) {
          const pulse = 0.3 + Math.sin(clock.elapsedTime * 3 + c.x) * 0.1
          // Simulating emissive intensity via color brightness for instancing parity
          tempColor.copy(baseColor).multiplyScalar(1 + pulse * 2)
          meshRef.current.setColorAt(i, tempColor)
      } else {
          meshRef.current.setColorAt(i, baseColor)
      }
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <group rotation={[-tilt * Math.PI / 180, 0, 0]} position={[0, 0.5, 0]}>
      {/* Backing frame */}
      <Box args={[2.6, 0.03, 2.0]}>
        <meshStandardMaterial color="#0a1515" metalness={0.9} roughness={0.2} />
      </Box>
      
      {/* Instanced Cells */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, cells.length]}>
        <boxGeometry args={[0.28, 0.02, 0.28]} />
        <meshStandardMaterial 
            metalness={0.95} 
            roughness={0.05 + soiling * 0.4} 
        />
      </instancedMesh>

      {/* Busbar lines */}
      {Array.from({ length: 7 }).map((_, i) => (
        <Box key={`h${i}`} args={[2.6, 0.03, 0.008]} position={[0, 0.03, -0.75 + i * 0.3]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </Box>
      ))}
    </group>
  )
}

// Inverter box
function InverterBox({ load, health }: { load: number, health: number }) {
  const ledRef = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshBasicMaterial
      mat.color.setHSL(health * 0.33, 1, 0.5 + Math.sin(clock.elapsedTime * 4) * 0.1)
    }
  })
  return (
    <group position={[4, 0, 0]}>
      <Box args={[1.2, 1.8, 0.6]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#0c1810" metalness={0.8} roughness={0.3} />
      </Box>
      {/* Fan grille */}
      <Cylinder args={[0.22, 0.22, 0.05, 16]} position={[0, 1.5, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#050e08" metalness={0.9} />
      </Cylinder>
      {/* Status LED */}
      <mesh ref={ledRef} position={[0.3, 0.5, 0.31]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      {/* Load bar */}
      <Box args={[0.08, 1.4 * load, 0.05]} position={[-0.3, 0.2 + 0.7 * load, 0.31]}>
        <meshBasicMaterial color={load > 0.8 ? '#ff4444' : '#00ffaa'} />
      </Box>
      <Text position={[0, 2.1, 0]} fontSize={0.22} color="#88ffcc" anchorX="center">INVERTER</Text>
      <Text position={[0, 1.85, 0]} fontSize={0.18} color="#00ffaa" anchorX="center">{Math.round(load * 100)}% load</Text>
    </group>
  )
}

// Battery pack
function BatteryPack({ charge }: { charge: number }) {
  return (
    <group position={[-4, 0, 0]}>
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={i} position={[0, 0, -0.6 + i * 0.4]}>
          <Box args={[1.0, 1.6, 0.32]} position={[0, 0.8, 0]}>
            <meshStandardMaterial color="#0a1a10" metalness={0.7} roughness={0.4} />
          </Box>
          <Box args={[0.7, 1.4 * charge, 0.34]} position={[0, 0.1 + 0.7 * charge, 0.01]}>
            <meshBasicMaterial color={charge > 0.5 ? '#00dd88' : '#ffaa00'} transparent opacity={0.6} />
          </Box>
        </group>
      ))}
      <Text position={[0, 2.2, 0]} fontSize={0.22} color="#88ffcc" anchorX="center">BATTERY PACK</Text>
      <Text position={[0, 1.95, 0]} fontSize={0.18} color="#00ffaa" anchorX="center">{Math.round(charge * 100)}% SOC</Text>
    </group>
  )
}

// Junction Box
function JunctionBox() {
  return (
    <group position={[0, 0, -3]}>
      <Box args={[0.8, 0.5, 0.3]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#0c1810" metalness={0.8} roughness={0.3} />
      </Box>
      {/* Wire stubs */}
      {[-0.2, 0, 0.2].map((x, i) => (
        <Cylinder key={i} args={[0.02, 0.02, 0.5, 6]} position={[x, 0.25, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#223322" />
        </Cylinder>
      ))}
      <Text position={[0, 1, 0]} fontSize={0.2} color="#88ccaa" anchorX="center">JUNCTION</Text>
    </group>
  )
}

// Current flow wire visualization
function WireFlow({ from, to, active }: { from: THREE.Vector3, to: THREE.Vector3, active: boolean }) {
  const geomRef = useRef<THREE.BufferGeometry>(null!)
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const { points, offsets } = useMemo(() => {
    const curve = new THREE.LineCurve3(from, to)
    const n = 60
    const pts = curve.getPoints(n)
    const offs = new Float32Array(n + 1)
    pts.forEach((_, i) => { offs[i] = i / n })
    return { points: pts, offsets: offs }
  }, [from, to])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  if (!active) return null

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
        />
        <bufferAttribute attach="attributes-aOffset" args={[offsets, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={`
          uniform float uTime;
          attribute float aOffset;
          varying float vAlpha;
          void main() {
            float phase = mod(aOffset - uTime * 0.8, 1.0);
            vAlpha = smoothstep(0.0, 0.15, phase) * smoothstep(0.5, 0.2, phase);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 4.0 * vAlpha;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d) * vAlpha;
            gl_FragColor = vec4(0.0, 1.0, 0.7, a);
          }
        `}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
      />
    </points>
  )
}

// Electron cloud orbiting battery (reuse electron shader)
function ElectronCloud({ active, flux }: { active: boolean, flux: number }) {
  const geomRef = useRef<THREE.BufferGeometry>(null!)
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const { positions, angles, radii, speeds, heights } = useMemo(() => {
    const N = 400
    const pos = new Float32Array(N * 3)
    const ang = new Float32Array(N)
    const rad = new Float32Array(N)
    const spd = new Float32Array(N)
    const hgt = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i * 3] = 0; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = 0
      ang[i] = Math.random() * Math.PI * 2
      rad[i] = 0.5 + Math.random() * 1.0
      spd[i] = 0.5 + Math.random() * 1.0
      hgt[i] = -0.3 + Math.random() * 0.6
    }
    return { positions: pos, angles: ang, radii: rad, speeds: spd, heights: hgt }
  }, [])

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime
      matRef.current.uniforms.uFlux.value = active ? flux : 0
    }
  })

  return (
    <points position={[-4, 0.8, 0]}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aAngle" args={[angles, 1]} />
        <bufferAttribute attach="attributes-aRadius" args={[radii, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aHeight" args={[heights, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={electronVertexShader}
        fragmentShader={electronFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uFlux: { value: flux }
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export function MesoScene() {
  const { panelTilt, soilingFactor, inverterLoad, gridEnergy, nodes, selectedNodeId } = useSimStore()
  const selectedNode = nodes.find(n => n.id === selectedNodeId)
  const charge = Math.min(1, gridEnergy / 2000)
  const active = selectedNode?.active ?? true

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#040e08" />
      </mesh>

      {/* Mounting structure */}
      {[-1.4, 0, 1.4].map((x, i) => (
        <Cylinder key={i} args={[0.06, 0.08, 1.2, 6]} position={[x, 0.6, 0.8]}>
          <meshStandardMaterial color="#0a2015" metalness={0.8} />
        </Cylinder>
      ))}

      <PanelArray tilt={panelTilt} soiling={soilingFactor} active={active} />
      <InverterBox load={inverterLoad} health={selectedNode?.health ?? 1} />
      <BatteryPack charge={charge} />
      <JunctionBox />

      {/* Wire flows */}
      <WireFlow
        from={new THREE.Vector3(0, 0.5, -0.5)}
        to={new THREE.Vector3(0, 0.5, -3)}
        active={active}
      />
      <WireFlow
        from={new THREE.Vector3(0.5, 0.5, -3)}
        to={new THREE.Vector3(4, 0.5, -3)}
        active={active}
      />
      <WireFlow
        from={new THREE.Vector3(4, 0.5, -3)}
        to={new THREE.Vector3(4, 0.5, 0)}
        active={active}
      />
      <WireFlow
        from={new THREE.Vector3(-0.5, 0.5, -3)}
        to={new THREE.Vector3(-4, 0.5, -3)}
        active={active}
      />
      <WireFlow
        from={new THREE.Vector3(-4, 0.5, -3)}
        to={new THREE.Vector3(-4, 0.5, 0)}
        active={active}
      />

      <ElectronCloud active={active} flux={inverterLoad} />

      {/* Labels */}
      <Text position={[0, 3.5, 0]} fontSize={0.4} color="#00ffaa" anchorX="center">
        ASSET DETAIL VIEW
      </Text>
      <Text position={[0, 3.0, 0]} fontSize={0.25} color="#44aa88" anchorX="center">
        Click components • Drag sliders to control
      </Text>

      <fog attach="fog" args={['#020a06', 15, 40]} />
      <ambientLight intensity={0.2} color="#002211" />
      <directionalLight position={[5, 10, 5]} intensity={0.6} color="#88ffcc" />
      <pointLight position={[4, 2, 0]} intensity={3} color="#ff8800" distance={8} />
      <pointLight position={[-4, 2, 0]} intensity={2} color="#0088ff" distance={8} />
    </group>
  )
}
