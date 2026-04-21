import { useEffect } from 'react'
import { useSimStore } from '../../store/useSimStore'
import type { EnergyNode } from '../../store/useSimStore'

// ---- Stat pill ----
function StatPill({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="stat-pill-v2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, minWidth: 100 }}>
      <span style={{ fontSize: 9, color: 'var(--text-main)', opacity: 0.4, fontFamily: 'Space Mono, monospace', letterSpacing: 2, textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: 16, color, fontFamily: 'Outfit, sans-serif', fontWeight: 700, letterSpacing: -0.5 }}>{value}</span>
    </div>
  )
}

// ---- Stat Item (Reactive) ----
function StatItem({ label, selector, color }: { label: string, selector: (s: any) => string, color: string }) {
  const value = useSimStore(selector)
  return <StatPill label={label} value={value} color={color} />
}

// ---- Header bar ----
function TimeDisplay() {
  const timeOfDay = useSimStore(s => s.timeOfDay)
  const h = Math.floor(timeOfDay)
  const m = Math.floor((timeOfDay - h) * 60)
  const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  const isDaytime = timeOfDay >= 6 && timeOfDay <= 20
  
  return <StatPill label="Simulation Time" value={`${timeStr} ${isDaytime ? 'SYSTEM_DAY' : 'SYSTEM_NIGHT'}`} color="var(--text-main)" />
}

function GenerationDisplay() {
  const totalProduction = useSimStore(s => 
    s.nodes.filter(n => n.production > 0 && n.active).reduce((sum, n) => sum + n.production, 0)
  )
  return <StatPill label="Avg. Generation" value={`${Math.round(totalProduction)} kWh`} color="var(--accent-primary)" />
}

function SystemLoadDisplay() {
  const totalLoad = useSimStore(s => 
    Math.abs(s.nodes.filter(n => n.production < 0).reduce((sum, n) => sum + n.production, 0))
  )
  return <StatPill label="Grid Demand" value={`${Math.round(totalLoad)} kWh`} color="#f43f5e" />
}

function HeaderBar() {
  const theme = useSimStore(s => s.theme)
  const xp = useSimStore(s => s.xp)
  const toggleTheme = useSimStore(s => s.toggleTheme)
  const setCurrentView = useSimStore(s => s.setCurrentView)
  
  const level = Math.floor(xp / 1000) + 1

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      background: 'linear-gradient(180deg, rgba(10,12,16,0.9) 0%, rgba(10,12,16,0) 100%)',
      padding: '32px 48px',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      zIndex: 1000,
      pointerEvents: 'all'
    }}>
      <div style={{ display: 'flex', gap: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div 
            onClick={() => setCurrentView('landing')}
            style={{
              width: 50, height: 50, borderRadius: 12,
              background: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px var(--accent-primary)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <span style={{ fontSize: 24, color: '#000' }}>⚡</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, color: 'var(--text-main)', letterSpacing: -1, fontWeight: 900 }}>SOLARIS</div>
            <div style={{ fontFamily: 'Space Mono, sans-serif', fontSize: 9, color: 'var(--accent-primary)', opacity: 0.8, letterSpacing: 1.5, fontWeight: 700 }}>NEXUS_OS / v3.4.1</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 40, borderLeft: '1px solid var(--border-ui)', paddingLeft: 40, alignItems: 'center' }}>
          <StatPill label="PLAYER_LEVEL" value={`LVL ${level}`} color="#0ea5e9" />
          <StatPill label="EXPERIENCE" value={`${xp} XP`} color="#00ffaa" />
          <StatItem label="CO2 REDUCTION" selector={s => `${Math.round(s.co2Offset)} kg`} color="var(--accent-primary)" />
          <GenerationDisplay />
          <SystemLoadDisplay />
          <TimeDisplay />
        </div>
      </div>


      <div style={{ display: 'flex', gap: 16 }}>
        <button 
          onClick={toggleTheme}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-ui)',
            color: 'var(--text-main)', width: 44, height: 44, borderRadius: 12,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            backdropFilter: 'blur(10px)', transition: 'all 0.3s'
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button 
          onClick={() => setCurrentView('landing')}
          style={{
            background: 'var(--text-main)', color: 'var(--bg-base)', border: 'none',
            padding: '0 24px', height: 44, borderRadius: 12, fontSize: 11, fontWeight: 900,
            fontFamily: 'Outfit, sans-serif', letterSpacing: 1, cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          EXIT_SYSTEM
        </button>
      </div>
    </div>
  )
}

// ---- Slider ----
function Slider({ label, value, min, max, step, unit, onChange, color = 'var(--accent-primary)' }: {
  label: string, value: number, min: number, max: number, step: number, unit: string, onChange: (v: number) => void, color?: string
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: 'var(--text-main)', opacity: 0.5, fontFamily: 'Space Mono, sans-serif', fontWeight: 600 }}>{label.toUpperCase()}</span>
        <span style={{ fontSize: 13, color, fontFamily: 'Space Mono, sans-serif', fontWeight: 700 }}>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: color, cursor: 'pointer', height: 4 }}
      />
    </div>
  )
}

// ---- Node info panel ----
function NodePanel({ node }: { node: EnergyNode }) {
  const { toggleNode, setZoomLevel } = useSimStore()
  const healthColor = node.health > 0.9 ? 'var(--accent-primary)' : node.health > 0.7 ? '#f59e0b' : '#ef4444'
  
  return (
    <div style={{ padding: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, borderBottom: '1px solid var(--border-ui)', paddingBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, color: 'var(--text-main)', fontWeight: 800 }}>{node.label}</div>
          <div style={{ fontSize: 9, color: 'var(--accent-primary)', opacity: 0.5, fontFamily: 'Space Mono', marginTop: 4 }}>ID: {node.id.toUpperCase()} / ASSET_READY</div>
        </div>
        <div style={{
          width: 12, height: 12, borderRadius: '50%',
          background: node.active ? 'var(--accent-primary)' : '#ef4444',
          boxShadow: node.active ? '0 0 15px var(--accent-primary)' : '0 0 15px #ef4444'
        }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <StatPill label="Health Index" value={`${Math.round(node.health * 100)}%`} color={healthColor} />
        <StatPill label="Active State" value={node.active ? 'ONLINE' : 'OFFLINE'} color={node.active ? 'var(--accent-primary)' : '#ef4444'} />
        <StatPill label="Real-time Output" value={`${Math.abs(node.production)} kWh`} color="var(--accent-secondary)" />
        <StatPill label="Asset Class" value={node.type.replace('_', ' ').toUpperCase()} color="var(--text-main)" />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => toggleNode(node.id)}
          style={{
            flex: 1, padding: '14px 0', border: '1px solid var(--border-ui)',
            background: node.active ? 'rgba(255,255,255,0.03)' : 'var(--accent-primary)',
            color: node.active ? 'var(--text-main)' : '#000',
            fontFamily: 'Outfit, sans-serif', fontSize: 11, cursor: 'pointer', borderRadius: 12, fontWeight: 700,
            transition: 'all 0.3s'
          }}
        >
          {node.active ? 'POWER_DOWN' : 'ACTIVATE'}
        </button>
        {(node.type === 'solar_farm' || node.type === 'battery') && (
          <button
            onClick={() => setZoomLevel('meso')}
            style={{
              flex: 1, padding: '14px 0', border: '1px solid var(--border-ui)',
              background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)',
              fontFamily: 'Outfit, sans-serif', fontSize: 11, cursor: 'pointer', borderRadius: 12, fontWeight: 700,
              transition: 'all 0.3s'
            }}
          >
            DEEP_INSPECT
          </button>
        )}
      </div>
    </div>
  )
}

function MacroControls() {
  const selectedNodeId = useSimStore(s => s.selectedNodeId)
  const nodes = useSimStore(s => s.nodes)
  const executeTrade = useSimStore(s => s.executeTrade)
  const timeOfDay = useSimStore(s => s.timeOfDay)
  const setTimeOfDay = useSimStore(s => s.setTimeOfDay)
  const weatherIntensity = useSimStore(s => s.weatherIntensity)
  const setWeatherIntensity = useSimStore(s => s.setWeatherIntensity)
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId)
  const solarNodes = nodes.filter(n => n.type === 'solar_farm' && n.active)
  const houseNodes = nodes.filter(n => n.type === 'house')

  const handleTrade = () => {
    if (solarNodes.length && houseNodes.length) {
      const seller = solarNodes[Math.floor(Math.random() * solarNodes.length)]
      const buyer = houseNodes[Math.floor(Math.random() * houseNodes.length)]
      executeTrade(seller.id, buyer.id, Math.round(50 + Math.random() * 200), Math.round(20 + Math.random() * 80))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {selectedNode ? (
        <NodePanel node={selectedNode} />
      ) : (
        <div style={{ color: 'var(--text-main)', opacity: 0.3, fontFamily: 'Space Mono', fontSize: 11, textAlign: 'center', padding: '40px 20px', border: '1px dashed var(--border-ui)', borderRadius: 16 }}>
          AWAITING_NODE_SELECTION...
        </div>
      )}

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: 16, border: '1px solid var(--border-ui)' }}>
        <Slider label="Time Cycle" value={parseFloat(timeOfDay.toFixed(1))} min={0} max={24} step={0.1} unit="h" onChange={setTimeOfDay} color="#f59e0b" />
        <Slider label="Weather Intensity" value={Math.round(weatherIntensity * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => setWeatherIntensity(v / 100)} color="var(--accent-secondary)" />
        
        <button
          onClick={handleTrade}
          style={{
            width: '100%', padding: '16px 0', marginTop: 12,
            background: 'var(--accent-primary)', border: 'none', color: '#000', 
            fontFamily: 'Outfit, sans-serif', fontSize: 12, cursor: 'pointer', borderRadius: 12, 
            fontWeight: 800, transition: 'all 0.3s', boxShadow: '0 0 20px var(--accent-primary)'
          }}
        >
          EXECUTE AMM TRADE
        </button>
      </div>
    </div>
  )
}

function MesoControls() {
  const panelTilt = useSimStore(s => s.panelTilt)
  const soilingFactor = useSimStore(s => s.soilingFactor)
  const inverterLoad = useSimStore(s => s.inverterLoad)
  const mesoComponents = useSimStore(s => s.mesoComponents)
  const setPanelTilt = useSimStore(s => s.setPanelTilt)
  const setSoilingFactor = useSimStore(s => s.setSoilingFactor)
  const setInverterLoad = useSimStore(s => s.setInverterLoad)
  const setZoomLevel = useSimStore(s => s.setZoomLevel)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Slider label="Array Tilt Angle" value={panelTilt} min={0} max={90} step={1} unit="°" onChange={setPanelTilt} />
      <Slider label="Accumulated Dust" value={Math.round(soilingFactor * 100)} min={0} max={100} step={1} unit="%" onChange={v => setSoilingFactor(v / 100)} color="#a8a29e" />
      <Slider label="Inverter Load" value={Math.round(inverterLoad * 100)} min={0} max={100} step={1} unit="%" onChange={v => setInverterLoad(v / 100)} color={inverterLoad > 0.85 ? '#ef4444' : 'var(--accent-primary)'} />

      <div style={{ borderTop: '1px solid var(--border-ui)', paddingTop: 24 }}>
        <div style={{ fontSize: 9, color: 'var(--accent-primary)', opacity: 0.6, fontFamily: 'Space Mono', letterSpacing: 2, marginBottom: 20, fontWeight: 700 }}>SUBSYSTEM_INTEGRITY</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mesoComponents.map(comp => (
            <div key={comp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid var(--border-ui)' }}>
              <span style={{ fontSize: 11, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>{comp.name}</span>
              <span style={{ fontSize: 11, color: comp.health > 0.9 ? 'var(--accent-primary)' : '#f59e0b', fontFamily: 'Space Mono', fontWeight: 700 }}>{Math.round(comp.health * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
         <button onClick={() => setZoomLevel('macro')} style={{ flex: 1, padding: '14px 0', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-ui)', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif', fontSize: 11, cursor: 'pointer', borderRadius: 12, fontWeight: 700 }}>BACK_TO_GRID</button>
         <button onClick={() => setZoomLevel('atomic')} style={{ flex: 1, padding: '14px 0', background: 'var(--accent-secondary)', border: 'none', color: '#fff', fontFamily: 'Outfit, sans-serif', fontSize: 11, cursor: 'pointer', borderRadius: 12, fontWeight: 700, boxShadow: '0 0 15px var(--accent-secondary)' }}>GO ATOMIC</button>
      </div>
    </div>
  )
}

function AtomicControls() {
  const photonRate = useSimStore(s => s.photonRate)
  const electronFlux = useSimStore(s => s.electronFlux)
  const bandgapVoltage = useSimStore(s => s.bandgapVoltage)
  const atomicMode = useSimStore(s => s.atomicMode)
  const setPhotonRate = useSimStore(s => s.setPhotonRate)
  const setAtomicMode = useSimStore(s => s.setAtomicMode)
  const setZoomLevel = useSimStore(s => s.setZoomLevel)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 8, background: 'rgba(0,0,0,0.2)', padding: 6, borderRadius: 14 }}>
        {(['photovoltaic', 'battery', 'electron_flow'] as const).map(m => (
          <button
            key={m}
            onClick={() => setAtomicMode(m)}
            style={{
              flex: 1, padding: '10px 0',
              border: 'none',
              background: atomicMode === m ? 'var(--accent-secondary)' : 'transparent',
              color: atomicMode === m ? '#fff' : 'var(--text-main)',
              fontFamily: 'Outfit, sans-serif', fontSize: 10, cursor: 'pointer', borderRadius: 10, fontWeight: 700,
              transition: 'all 0.3s'
            }}
          >
            {m.split('_')[0].toUpperCase()}
          </button>
        ))}
      </div>

      <Slider label="Photon Intensity" value={Math.round(photonRate * 100)} min={0} max={100} step={1} unit="%" onChange={v => setPhotonRate(v / 100)} color="#f59e0b" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: '1px solid var(--border-ui)' }}>
        <StatPill label="Electron Flux" value={`${Math.round(electronFlux * 100)}%`} color="var(--accent-secondary)" />
        <StatPill label="Bandgap" value={`${bandgapVoltage} eV`} color="#f97316" />
        <StatPill label="Exciton Rate" value={`${Math.round(electronFlux * photonRate * 22.4)}%`} color="var(--accent-primary)" />
        <StatPill label="Quantum State" value="STABLE" color="var(--accent-primary)" />
      </div>

      <button onClick={() => setZoomLevel('meso')} style={{ width: '100%', padding: '16px 0', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-ui)', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif', fontSize: 12, cursor: 'pointer', borderRadius: 12, fontWeight: 700, marginTop: 8 }}>EXIT ATOMIC_VIEW</button>
    </div>
  )
}

function TradeLog() {
  const trades = useSimStore(s => s.trades)
  return (
    <div style={{ position: 'absolute', bottom: 48, left: 48, width: 340, zIndex: 1000, pointerEvents: 'all' }}>
      <div style={{ fontSize: 9, color: 'var(--accent-primary)', opacity: 0.6, fontFamily: 'Space Mono', letterSpacing: 2, marginBottom: 20, fontWeight: 800 }}>DEX_TRANSACTION_FEED</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 220, overflowY: 'auto', paddingRight: 10 }}>
        {trades.slice(0, 8).map(t => (
          <div key={t.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 20px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: 14,
            border: '1px solid var(--border-ui)', backdropFilter: 'blur(12px)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-main)', fontFamily: 'Space Mono', fontWeight: 600 }}>
              {t.seller.toUpperCase().split('_')[0]} → {t.buyer.toUpperCase().split('_')[0]}
            </span>
            <span style={{ fontSize: 12, color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif', fontWeight: 900 }}>
              +{t.amount} kWh
            </span>
          </div>
        ))}
        {trades.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-main)', opacity: 0.2, fontFamily: 'Space Mono', textAlign: 'center', padding: 40, border: '1px dashed var(--border-ui)', borderRadius: 16 }}>
            AWAITING_PACKET_TRANSFER...
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function RightPanel() {
  const zoomLevel = useSimStore(s => s.zoomLevel)
  const titles: Record<string, string> = {
    macro: 'GRID_DOMAIN_CONTROLS',
    meso: 'ASSET_PHYSICS_MATRIX',
    atomic: 'QUANTUM_STATE_SYNC'
  }

  return (
    <div style={{
      position: 'absolute', top: 120, right: 48, width: 380, zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.85)',
      border: '1px solid var(--border-ui)',
      borderRadius: 24, padding: '32px 24px',
      backdropFilter: 'blur(30px)',
      boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: 'all'
    }}>
      <div style={{ fontFamily: 'Space Mono, sans-serif', fontSize: 10, color: 'var(--accent-primary)', letterSpacing: 3, marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid var(--border-ui)', fontWeight: 800 }}>
        {titles[zoomLevel]}
      </div>
      {zoomLevel === 'macro' && <MacroControls />}
      {zoomLevel === 'meso' && <MesoControls />}
      {zoomLevel === 'atomic' && <AtomicControls />}
    </div>
  )
}

function ZoomHint() {
  const zoomLevel = useSimStore(s => s.zoomLevel)
  const hints: Record<string, string> = {
    macro: 'Interrogate active energy nodes to synchronize localized telemetry',
    meso: 'Modulate topology and environmental factors to optimize yields',
    atomic: 'Manipulate photon density to observe bandgap excitation'
  }
  return (
    <div style={{
      position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)',
      fontFamily: 'Space Mono, sans-serif', fontSize: 10, color: 'var(--accent-primary)', opacity: 0.5,
      letterSpacing: 1, textAlign: 'center', zIndex: 1000, pointerEvents: 'none', fontWeight: 600,
      background: 'rgba(0,0,0,0.4)', padding: '10px 20px', borderRadius: '40px', backdropFilter: 'blur(5px)'
    }}>
      <span style={{ marginRight: 10 }}>[SYSTEM_HINT]</span> {hints[zoomLevel].toUpperCase()}
    </div>
  )
}

export function HUD() {
  return (
    <div className="hud-layer" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <HeaderBar />
      <RightPanel />
      <TradeLog />
      <ZoomHint />
    </div>
  )
}
