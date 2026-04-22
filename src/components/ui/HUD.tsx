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
  const marketplaceOpen = useSimStore(s => s.marketplaceOpen)
  const toggleMarketplace = useSimStore(s => s.toggleMarketplace)
  
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
          <StatPill label="PLAYER_LEVEL" value={`LVL ${level}`} color="var(--accent-secondary)" />
          <StatPill label="EXPERIENCE" value={`${xp} XP`} color="var(--accent-primary)" />
          <StatItem label="CO2 REDUCTION" selector={s => `${Math.round(s.co2Offset)} kg`} color="var(--accent-primary)" />
          <GenerationDisplay />
          <SystemLoadDisplay />
          <TimeDisplay />
        </div>
      </div>


      <div style={{ display: 'flex', gap: 16 }}>
        <button 
          onClick={toggleMarketplace}
          style={{
            background: marketplaceOpen ? 'rgba(0, 255, 170, 0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${marketplaceOpen ? 'var(--accent-primary)' : 'var(--border-ui)'}`,
            color: marketplaceOpen ? 'var(--accent-primary)' : 'var(--text-main)',
            height: 44, padding: '0 20px', borderRadius: 12,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 10, fontWeight: 900, fontFamily: 'Space Mono', letterSpacing: 2,
            backdropFilter: 'blur(10px)', transition: 'all 0.3s',
            boxShadow: marketplaceOpen ? '0 0 20px rgba(0, 255, 170, 0.2)' : 'none'
          }}
        >
          <span style={{ fontSize: 16 }}>📊</span>
          MARKET_PROTOCOL
        </button>

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
  const { toggleNode, setZoomLevel, theme } = useSimStore()
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <StatPill label="Thermal Sync" value={`${node.temperature.toFixed(1)}°C`} color={node.temperature > 40 ? '#ef4444' : 'var(--accent-primary)'} />
        <StatPill label="Voltage Drop" value="0.042 V" color="var(--accent-secondary)" />
        <StatPill label="Packet Entropy" value="0.002" color="var(--accent-primary)" />
        <StatPill label="Grid Displ." value="4.2mm" color="var(--accent-secondary)" />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12, border: '1px solid var(--border-ui)', marginBottom: 24 }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 8, opacity: 0.4 }}>ASSET_EFFICIENCY_METRIC</span>
            <span style={{ fontSize: 10, color: 'var(--accent-primary)', fontWeight: 800 }}>{Math.round(node.health * 100)}%</span>
         </div>
         <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${node.health * 100}%`, background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }} />
         </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => toggleNode(node.id)}
          style={{
            flex: 1, padding: '14px 0', border: '1px solid var(--border-ui)',
            background: node.active ? 'rgba(255,255,255,0.03)' : 'var(--accent-primary)',
            color: node.active ? (theme === 'dark' ? '#000' : '#fff') : (theme === 'dark' ? '#000' : '#fff'),
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
  const { 
    selectedNodeId, nodes, timeOfDay, setTimeOfDay, 
    weatherIntensity, setWeatherIntensity,
    autoTradeEnabled, toggleAutoTrade 
  } = useSimStore()
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {selectedNode ? (
        <NodePanel node={selectedNode} />
      ) : (
        <div style={{ padding: '40px 20px', border: '1px dashed var(--border-ui)', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text-main)', opacity: 0.3, fontFamily: 'Space Mono', letterSpacing: 2 }}>AWAITING_TELEMETRY_LINK...</div>
        </div>
      )}

      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: 20, border: '1px solid var(--border-ui)', borderLeft: '4px solid var(--accent-primary)' }}>
        <div style={{ fontSize: 9, color: 'var(--accent-primary)', opacity: 0.6, fontFamily: 'Space Mono', letterSpacing: 2, marginBottom: 20, fontWeight: 800 }}>GLOBAL_COMMAND_OVERRIDE</div>
        
        <Slider label="Temporal Phase" value={parseFloat(timeOfDay.toFixed(1))} min={0} max={24} step={0.1} unit="h" onChange={setTimeOfDay} color="#f59e0b" />
        <Slider label="Atmos. Turbulence" value={Math.round(weatherIntensity * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => setWeatherIntensity(v / 100)} color="var(--accent-secondary)" />
        
        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
           <button
             onClick={toggleAutoTrade}
             style={{
               flex: 1, padding: '16px 0',
               background: autoTradeEnabled ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
               border: `1px solid ${autoTradeEnabled ? 'var(--accent-primary)' : 'var(--border-ui)'}`,
               color: autoTradeEnabled ? '#000' : 'var(--text-main)', 
               fontFamily: 'Outfit, sans-serif', fontSize: 11, cursor: 'pointer', borderRadius: 12, 
               fontWeight: 900, transition: 'all 0.3s',
               boxShadow: autoTradeEnabled ? '0 0 15px var(--accent-primary)' : 'none'
             }}
           >
             {autoTradeEnabled ? 'AUTONOMOUS_ENABLED' : 'MANUAL_OVERRIDE'}
           </button>
        </div>
      </div>

      {/* Grid Inspector Gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
         <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid var(--border-ui)' }}>
            <div style={{ fontSize: 8, color: 'var(--text-main)', opacity: 0.4, marginBottom: 8 }}>GRID_FREQUENCY</div>
            <div style={{ fontSize: 18, color: 'var(--accent-primary)', fontWeight: 800 }}>50.02 <span style={{ fontSize: 10 }}>Hz</span></div>
         </div>
         <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid var(--border-ui)' }}>
            <div style={{ fontSize: 8, color: 'var(--text-main)', opacity: 0.4, marginBottom: 8 }}>VOLTAGE_STABILITY</div>
            <div style={{ fontSize: 18, color: 'var(--accent-secondary)', fontWeight: 800 }}>99.9%</div>
         </div>
      </div>
    </div>
  )
}

function MesoControls() {
  const { 
    panelTilt, setPanelTilt, soilingFactor, setSoilingFactor, 
    inverterLoad, setInverterLoad, mesoComponents, setZoomLevel, theme
  } = useSimStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Slider label="Array Azimuth / Tilt" value={panelTilt} min={0} max={90} step={1} unit="°" onChange={setPanelTilt} />
      <Slider label="Particulate Accumulation" value={Math.round(soilingFactor * 100)} min={0} max={100} step={1} unit="%" onChange={v => setSoilingFactor(v / 100)} color="#a8a29e" />
      <Slider label="Harmonic Load Dist." value={Math.round(inverterLoad * 100)} min={0} max={100} step={1} unit="%" onChange={v => setInverterLoad(v / 100)} color={inverterLoad > 0.85 ? '#ef4444' : 'var(--accent-primary)'} />

      <div style={{ borderTop: '1px solid var(--border-ui)', paddingTop: 24 }}>
        <div style={{ fontSize: 9, color: 'var(--accent-primary)', opacity: 0.6, fontFamily: 'Space Mono', letterSpacing: 2, marginBottom: 20, fontWeight: 700 }}>SUBSYSTEM_INTEGRITY_MATRIX</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {mesoComponents.map(comp => (
            <div key={comp.id} style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '12px 16px', background: 'rgba(255,255,255,0.02)', 
              borderRadius: 12, border: '1px solid var(--border-ui)' 
            }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-main)', fontWeight: 700 }}>{comp.name}</div>
                <div style={{ fontSize: 8, color: 'var(--text-main)', opacity: 0.4 }}>{comp.voltage}V / {comp.current}A</div>
              </div>
              <div style={{ height: 4, width: 60, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                 <div style={{ height: '100%', width: `${comp.health * 100}%`, background: comp.health > 0.9 ? 'var(--accent-primary)' : '#f59e0b' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
         <button onClick={() => setZoomLevel('macro')} style={{ flex: 1, padding: '16px 0', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-ui)', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif', fontSize: 11, cursor: 'pointer', borderRadius: 12, fontWeight: 900 }}>EXIT_DEEP_SYNC</button>
         <button onClick={() => setZoomLevel('atomic')} style={{ flex: 1, padding: '16px 0', background: 'var(--accent-secondary)', border: 'none', color: '#fff', fontFamily: 'Outfit, sans-serif', fontSize: 11, cursor: 'pointer', borderRadius: 12, fontWeight: 900, boxShadow: '0 0 20px var(--accent-secondary)' }}>QUANTUM_INIT</button>
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
    <div style={{ position: 'absolute', bottom: 48, right: 48, width: 340, zIndex: 1000, pointerEvents: 'all' }}>
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
          from { transform: translateX(20px); opacity: 0; }
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
      background: 'var(--panel-bg)',
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
      position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)',
      fontFamily: 'Space Mono, sans-serif', fontSize: 10, color: 'var(--accent-primary)', opacity: 0.5,
      letterSpacing: 1, textAlign: 'center', zIndex: 1000, pointerEvents: 'none', fontWeight: 600,
      background: 'rgba(0,0,0,0.4)', padding: '10px 20px', borderRadius: '40px', backdropFilter: 'blur(5px)'
    }}>
      <span style={{ marginRight: 10 }}>[SYSTEM_HINT]</span> {hints[zoomLevel].toUpperCase()}
    </div>
  )
}

function TelemetryBuffer() {
  const trades = useSimStore(s => s.trades)
  const nodes = useSimStore(s => s.nodes)
  const autoTradeEnabled = useSimStore(s => s.autoTradeEnabled)

  return (
    <div style={{ position: 'absolute', top: 120, left: 48, width: 300, zIndex: 1000, pointerEvents: 'none' }}>
      <div style={{ fontSize: 9, color: 'var(--accent-primary)', opacity: 0.6, fontFamily: 'Space Mono', letterSpacing: 2, marginBottom: 20, fontWeight: 800 }}>LIVE_TELEMETRY_STREAM</div>
      <div style={{ 
        display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'hidden', 
        fontFamily: 'Space Mono', fontSize: 9, color: 'var(--text-main)', opacity: 0.7 
      }}>
        <div style={{ color: 'var(--accent-primary)', marginBottom: 4 }}>[SYS] KERNEL_LOAD: STABLE</div>
        <div style={{ color: autoTradeEnabled ? 'var(--accent-primary)' : '#f59e0b', marginBottom: 4 }}>
          [SYS] AUTONOMOUS_MODE: {autoTradeEnabled ? 'ACTIVE' : 'STANDBY'}
        </div>
        {trades.slice(0, 10).map((t, i) => (
          <div key={t.id} style={{ animation: 'fadeTerminal 0.3s ease-out' }}>
            <span style={{ color: 'var(--accent-secondary)' }}>[{new Date(t.timestamp).toLocaleTimeString([], {hour12: false})}]</span> 
            {` TRD_MATCH: ${t.seller.split('_')[0].toUpperCase()} >> ${Math.round(t.amount)}kW >> ${t.buyer.split('_')[0].toUpperCase()}`}
          </div>
        ))}
        {nodes.filter(n => !n.active).map(n => (
          <div key={n.id} style={{ color: '#ef4444' }}>
            [WARN] OFFLINE_ABERRATION: {n.label.toUpperCase()}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeTerminal {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function ViewSwitcher() {
  const { zoomLevel, setZoomLevel } = useSimStore()
  const levels = [
    { id: 'macro', label: 'GRID', icon: '🌐' },
    { id: 'meso', label: 'FACILITY', icon: '🏭' },
    { id: 'atomic', label: 'QUANTUM', icon: '⚛️' }
  ]

  return (
    <div style={{
      position: 'absolute', bottom: 48, left: 48,
      display: 'flex', gap: 12, zIndex: 1000, pointerEvents: 'all'
    }}>
      {levels.map(l => (
        <button
          key={l.id}
          onClick={() => setZoomLevel(l.id as any)}
          style={{
            background: zoomLevel === l.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${zoomLevel === l.id ? 'var(--accent-primary)' : 'var(--border-ui)'}`,
            color: zoomLevel === l.id ? '#000' : 'var(--text-main)',
            padding: '12px 20px', borderRadius: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10,
            backdropFilter: 'blur(10px)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: zoomLevel === l.id ? '0 0 20px var(--accent-glow)' : 'none'
          }}
        >
          <span style={{ fontSize: 16 }}>{l.icon}</span>
          <span className="outfit" style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2 }}>{l.label}</span>
        </button>
      ))}
    </div>
  )
}

export function HUD() {
  const currentView = useSimStore(s => s.currentView)
  if (currentView !== 'experience') return null

  return (
    <div className="hud-layer" style={{ width: '100%', height: '100%', position: 'relative', pointerEvents: 'none' }}>
      <HeaderBar />
      <TelemetryBuffer />
      <RightPanel />
      <TradeLog />
      <ViewSwitcher />
      <ZoomHint />
    </div>
  )
}
