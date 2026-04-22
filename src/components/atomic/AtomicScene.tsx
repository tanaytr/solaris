import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'


// Photon particle system
function PhotonField({ rate }: { rate: number }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const { positions, velocities, phases, speeds } = useMemo(() => {
    const N = 300
    const pos = new Float32Array(N * 3)
    const vel = new Float32Array(N * 3)
    const pha = new Float32Array(N)
    const spd = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8
      pos[i * 3 + 1] = 5 + Math.random() * 3
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
      vel[i * 3] = (Math.random() - 0.5) * 0.1
      vel[i * 3 + 1] = -1
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.1
      pha[i] = Math.random()
      spd[i] = 0.5 + Math.random() * 0.8
    }
    return { positions: pos, velocities: vel, phases: pha, speeds: spd }
  }, [])

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime
      matRef.current.uniforms.uRate.value = rate
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aVelocity" args={[velocities, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={`
          uniform float uTime;
          uniform float uRate;
          attribute float aPhase;
          attribute float aSpeed;
          attribute vec3 aVelocity;
          varying float vAlpha;
          varying float vY;
          
          void main() {
            float t = mod(aPhase + uTime * aSpeed * 0.5, 1.0);
            vec3 pos = position + aVelocity * t * 12.0;
            // Reset when hits lattice level
            if (pos.y < 0.0) {
              pos = position;
            }
            vAlpha = uRate * smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.7, t);
            vY = pos.y;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 4.0;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          varying float vY;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d) * vAlpha;
            // Yellow-white photons
            vec3 color = mix(vec3(1.0, 1.0, 0.3), vec3(1.0, 0.95, 0.8), vY / 8.0);
            gl_FragColor = vec4(color, a);
          }
        `}
        uniforms={{ uTime: { value: 0 }, uRate: { value: rate } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Free electron flow after photon excitation
function FreeElectrons({ flux }: { flux: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const { positions, velocities, phases } = useMemo(() => {
    const N = 500
    const pos = new Float32Array(N * 3)
    const vel = new Float32Array(N * 3)
    const pha = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7
      // Drift in +x direction (electric field)
      vel[i * 3] = 0.8 + Math.random() * 0.4
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.1
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.3
      pha[i] = Math.random()
    }
    return { positions: pos, velocities: vel, phases: pha }
  }, [])

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime
      matRef.current.uniforms.uFlux.value = flux
    }
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aVel" args={[velocities, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={`
          uniform float uTime;
          uniform float uFlux;
          attribute vec3 aVel;
          attribute float aPhase;
          varying float vAlpha;
          
          void main() {
            float t = mod(aPhase + uTime * 0.4, 1.0);
            vec3 pos = position + aVel * t * 8.0;
            // Wrap x
            pos.x = mod(pos.x + 3.5, 7.0) - 3.5;
            pos.z = mod(pos.z + 3.5, 7.0) - 3.5;
            vAlpha = uFlux * 0.9;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 3.5;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d) * vAlpha;
            gl_FragColor = vec4(0.1, 0.8, 1.0, a);
          }
        `}
        uniforms={{ uTime: { value: 0 }, uFlux: { value: flux } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Holes (positive charge carriers)
function HoleFlow({ flux }: { flux: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const { positions, velocities, phases } = useMemo(() => {
    const N = 400
    const pos = new Float32Array(N * 3)
    const vel = new Float32Array(N * 3)
    const pha = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7
      // Holes move in -x direction
      vel[i * 3] = -0.6 - Math.random() * 0.3
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.08
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.3
      pha[i] = Math.random()
    }
    return { positions: pos, velocities: vel, phases: pha }
  }, [])

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime
      matRef.current.uniforms.uFlux.value = flux
    }
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aVel" args={[velocities, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={`
          uniform float uTime;
          uniform float uFlux;
          attribute vec3 aVel;
          attribute float aPhase;
          varying float vAlpha;
          
          void main() {
            float t = mod(aPhase + uTime * 0.4, 1.0);
            vec3 pos = position + aVel * t * 8.0;
            pos.x = mod(pos.x + 3.5, 7.0) - 3.5;
            pos.z = mod(pos.z + 3.5, 7.0) - 3.5;
            vAlpha = uFlux * 0.7;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 4.0;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d) * vAlpha;
            gl_FragColor = vec4(1.0, 0.3, 0.1, a);
          }
        `}
        uniforms={{ uTime: { value: 0 }, uFlux: { value: flux } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// The p-n junction plane
function PNJunction() {
  return (
    <group>
      {/* N-type region */}
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[4, 0.5, 7]} />
        <meshStandardMaterial color="#001a33" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* P-type region */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[4, 0.5, 7]} />
        <meshStandardMaterial color="#1a0010" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Junction plane */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.04, 0.6, 7]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      {/* Labels */}
      <Text position={[-2.5, 1, 0]} fontSize={0.5} color="#44aaff" anchorX="center" rotation={[0, 0, 0]}>N</Text>
      <Text position={[2.5, 1, 0]} fontSize={0.5} color="#ff4466" anchorX="center">P</Text>
      <Text position={[0, 1.2, 0]} fontSize={0.25} color="#aaaaaa" anchorX="center">p-n junction</Text>
    </group>
  )
}

// Optimized Silicon crystal lattice with Instancing
function SiliconLattice() {
  const atomMeshRef = useRef<THREE.InstancedMesh>(null!)
  const bondMeshRef = useRef<THREE.InstancedMesh>(null!)
  const tempObj = useMemo(() => new THREE.Object3D(), [])
  const tempColor = useMemo(() => new THREE.Color(), [])

  const { atoms, bonds } = useMemo(() => {
    const a: { pos: [number, number, number], type: 'si' | 'n' | 'p' }[] = []
    const b: { from: THREE.Vector3, to: THREE.Vector3, mid: THREE.Vector3, quat: THREE.Quaternion, length: number }[] = []
    const spacing = 0.8
    
    // Atoms
    for (let x = -4; x <= 4; x += spacing) {
      for (let z = -3; z <= 3; z += spacing) {
        const type = x < -0.1 ? 'n' : x > 0.1 ? 'p' : 'si'
        a.push({ pos: [x, 0, z], type })
      }
    }

    // Bonds
    for (let x = -4; x <= 3.2; x += spacing) {
      for (let z = -3; z <= 3; z += spacing) {
        const atomPairs = []
        if (x + spacing <= 4) atomPairs.push([new THREE.Vector3(x, 0, z), new THREE.Vector3(x + spacing, 0, z)])
        if (z + spacing <= 3) atomPairs.push([new THREE.Vector3(x, 0, z), new THREE.Vector3(x, 0, z + spacing)])
        
        atomPairs.forEach(([start, end]) => {
            const mid = start.clone().lerp(end, 0.5)
            const dir = end.clone().sub(start)
            const length = dir.length()
            const quat = new THREE.Quaternion()
            quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
            b.push({ from: start, to: end, mid, quat, length })
        })
      }
    }
    return { atoms: a, bonds: b }
  }, [])

  useFrame(({ clock }) => {
    if (!atomMeshRef.current || !bondMeshRef.current) return
    const time = clock.elapsedTime

    atoms.forEach((atom, i) => {
      const [px, py, pz] = atom.pos
      const dy = Math.sin(time * 1.5 + px * 2 + pz) * 0.03
      tempObj.position.set(px, py + dy, pz)
      tempObj.scale.setScalar(1)
      tempObj.updateMatrix()
      atomMeshRef.current.setMatrixAt(i, tempObj.matrix)
      
      const col = atom.type === 'si' ? '#1a4060' : atom.type === 'n' ? '#00aaff' : '#ff4466'
      tempColor.set(col)
      atomMeshRef.current.setColorAt(i, tempColor)
    })

    bonds.forEach((bond, i) => {
      tempObj.position.copy(bond.mid)
      tempObj.quaternion.copy(bond.quat)
      tempObj.scale.set(1, bond.length, 1)
      tempObj.updateMatrix()
      bondMeshRef.current.setMatrixAt(i, tempObj.matrix)
    })

    atomMeshRef.current.instanceMatrix.needsUpdate = true
    if (atomMeshRef.current.instanceColor) atomMeshRef.current.instanceColor.needsUpdate = true
    bondMeshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={bondMeshRef} args={[undefined, undefined, bonds.length]}>
        <cylinderGeometry args={[0.03, 0.03, 1, 6]} />
        <meshStandardMaterial color="#0a2035" metalness={0.7} roughness={0.4} transparent opacity={0.6} />
      </instancedMesh>
      
      <instancedMesh ref={atomMeshRef} args={[undefined, undefined, atoms.length]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial emissiveIntensity={0.6} metalness={0.9} roughness={0.1} />
      </instancedMesh>
    </group>
  )
}

export function AtomicScene() {
  const { photonRate, electronFlux, atomicMode, bandgapVoltage, theme } = useSimStore()

  const fogColor = theme === 'dark' ? '#000508' : '#f8fafc'
  const labelColor = theme === 'dark' ? '#88ffcc' : '#1e293b'
  const accentLevelColor = theme === 'dark' ? '#00ffcc' : '#0f172a'

  return (
    <group>
      {/* Background lattice */}
      <SiliconLattice />

      {/* p-n junction */}
      <PNJunction />

      {/* Photons rain down */}
      {atomicMode === 'photovoltaic' && <PhotonField rate={photonRate} />}

      {/* Free electrons drift */}
      <FreeElectrons flux={electronFlux} />

      {/* Holes move opposite */}
      <HoleFlow flux={electronFlux} />

      {/* Electric field arrow */}
      <group position={[0, -1, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 3, 8]} />
          <meshBasicMaterial color={theme === 'dark' ? "#ffaa00" : "#d97706"} transparent opacity={0.6} />
        </mesh>
        <mesh position={[1.7, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshBasicMaterial color={theme === 'dark' ? "#ffaa00" : "#d97706"} />
        </mesh>
        <Text position={[0, -0.4, 0]} fontSize={0.3} color={theme === 'dark' ? '#ffaa00' : '#92400e'} anchorX="center">Electric Field →</Text>
      </group>

      {/* Info labels */}
      <Text 
        position={[0, 6, 0]} 
        fontSize={0.4} 
        color={labelColor} 
        anchorX="center"
      >
        {atomicMode.toUpperCase()}_LATTICE
      </Text>
      <Text 
        position={[0, 5.5, 0]} 
        fontSize={0.2} 
        color={accentLevelColor} 
        anchorX="center"
      >
        QUANTUM_PHASE_ACTIVE
      </Text>
      <Text position={[0, 5.1, 0]} fontSize={0.25} color={theme === 'dark' ? '#aaaaaa' : '#475569'} anchorX="center">
        Bandgap: {bandgapVoltage.toFixed(2)} eV • Photon flux: {Math.round(photonRate * 100)}%
      </Text>

      <fog attach="fog" args={[fogColor, 10, 30]} />
      <ambientLight intensity={theme === 'dark' ? 0.15 : 0.6} color={theme === 'dark' ? "#001020" : "#fff"} />
      <directionalLight position={[0, 10, 0]} intensity={theme === 'dark' ? 0.4 : 1.0} color={theme === 'dark' ? "#ffff88" : "#fff"} />
      <pointLight position={[-3, 2, 0]} intensity={3} color={theme === 'dark' ? "#0044ff" : "#ea580c"} distance={10} />
      <pointLight position={[3, 2, 0]} intensity={3} color={theme === 'dark' ? "#ff0044" : "#f59e0b"} distance={10} />
      <pointLight position={[0, 5, 0]} intensity={2} color={theme === 'dark' ? "#ffcc00" : "#f59e0b"} distance={15} />
    </group>
  )
}
