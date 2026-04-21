import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ZoomLevel = 'macro' | 'meso' | 'atomic'
export type DayState = 'DAY' | 'DUSK' | 'NIGHT'
export type Theme = 'dark' | 'light'

export interface EnergyNode {
  id: string
  type: 'solar_farm' | 'house' | 'wind' | 'battery' | 'marketplace'
  position: [number, number, number]
  label: string
  production: number // kWh
  health: number // 0-1
  temperature: number // Celsius
  active: boolean
}

export interface EnergyPacket {
  id: string
  fromId: string
  toId: string
  amount: number // kWh
  startTime: number // Time in seconds
  duration: number // Duration in seconds
  color: string
}

export interface Trade {
  id: string
  seller: string
  buyer: string
  amount: number
  price: number
  timestamp: number
}

export interface MesoComponent {
  id: string
  name: string
  health: number
  temperature: number
  voltage: number
  current: number
}

interface SimStore {
  // Scene level
  zoomLevel: ZoomLevel
  selectedNodeId: string | null
  selectedComponentId: string | null

  // Macro
  nodes: EnergyNode[]
  packets: EnergyPacket[]
  trades: Trade[]
  gridEnergy: number 
  xp: number
  marketplaceOpen: boolean
  timeOfDay: number // 0-24
  
  // Simulation Metrics
  weatherIntensity: number // 0-1 (0 = clear, 1 = storm)
  co2Offset: number // Total kg of CO2 saved

  // Meso
  mesoComponents: MesoComponent[]
  panelTilt: number // degrees
  soilingFactor: number // 0-1 (dust/dirt)
  inverterLoad: number // 0-1

  // Atomic
  photonRate: number // photons/sec
  electronFlux: number // 0-1
  bandgapVoltage: number // eV
  atomicMode: 'photovoltaic' | 'battery' | 'electron_flow'
  dayState: DayState
  theme: Theme

  currentView: 'landing' | 'presentation' | 'experience' | 'marketplace'

  // Actions
  setCurrentView: (view: 'landing' | 'presentation' | 'experience' | 'marketplace') => void
  setZoomLevel: (level: ZoomLevel) => void
  selectNode: (id: string | null) => void
  selectComponent: (id: string | null) => void
  addPacket: (packet: EnergyPacket) => void
  removePacket: (id: string) => void
  executeTrade: (seller: string, buyer: string, amount: number, price: number) => void
  awardXP: (amount: number) => void
  toggleMarketplace: () => void
  setTimeOfDay: (t: number) => void
  setWeatherIntensity: (val: number) => void
  updateNodeTemperature: (id: string, temp: number) => void
  updateNodeHealth: (id: string, health: number) => void
  toggleNode: (id: string) => void
  setPanelTilt: (deg: number) => void
  setSoilingFactor: (f: number) => void
  setInverterLoad: (l: number) => void
  setPhotonRate: (r: number) => void
  setAtomicMode: (mode: 'photovoltaic' | 'battery' | 'electron_flow') => void
  addWindTurbine: (position: [number, number, number]) => void
  toggleTheme: () => void
  tick: (dt: number, elapsedTime: number) => void
}


const initialNodes: EnergyNode[] = [
  { id: 'sf1', type: 'solar_farm', position: [-18, 0, -10], label: 'Solar Farm Alpha', production: 850, health: 0.95, temperature: 42, active: true },
  { id: 'sf2', type: 'solar_farm', position: [-14, 0, 8], label: 'Solar Farm Beta', production: 620, health: 0.82, temperature: 48, active: true },
  { id: 'w1', type: 'wind', position: [16, 0, -12], label: 'Wind Array Gamma', production: 420, health: 0.98, temperature: 28, active: true },
  { id: 'bat1', type: 'battery', position: [0, 0, 0], label: 'Storage Hub', production: 200, health: 0.88, temperature: 35, active: true },
  { id: 'mp', type: 'marketplace', position: [2, 0, 14], label: 'Energy Exchange', production: 0, health: 1.0, temperature: 22, active: true },
  { id: 'h1', type: 'house', position: [10, 0, 8], label: 'Residential Block A', production: -180, health: 1.0, temperature: 24, active: true },
  { id: 'h2', type: 'house', position: [14, 0, 2], label: 'Residential Block B', production: -140, health: 1.0, temperature: 24, active: true },
  { id: 'h3', type: 'house', position: [-6, 0, 14], label: 'Industrial Zone', production: -380, health: 0.92, temperature: 30, active: true },
]

const initialComponents: MesoComponent[] = [
  { id: 'panel_array', name: 'PV Panel Array', health: 0.95, temperature: 42, voltage: 48.2, current: 18.6 },
  { id: 'inverter', name: 'String Inverter', health: 0.88, temperature: 56, voltage: 230, current: 8.2 },
  { id: 'junction', name: 'Junction Box', health: 0.99, temperature: 38, voltage: 47.8, current: 18.4 },
  { id: 'battery_pack', name: 'Battery Pack', health: 0.82, temperature: 45, voltage: 51.2, current: 12.0 },
  { id: 'bms', name: 'Battery Mgmt. System', health: 0.97, temperature: 32, voltage: 3.7, current: 0.5 },
]

let packetId = 0
let tradeId = 0
let nodeId = 100

export const useSimStore = create<SimStore>()(
  persist(
    (set, get) => ({
      zoomLevel: 'macro',
      selectedNodeId: null,
      selectedComponentId: null,
      nodes: initialNodes,
      packets: [],
      trades: [],
      gridEnergy: 1240,
      xp: 0,
      marketplaceOpen: false,
      timeOfDay: 12,
      weatherIntensity: 0.1,
      co2Offset: 4250,
      mesoComponents: initialComponents,
      panelTilt: 30,
      soilingFactor: 0.05,
      inverterLoad: 0.72,
      photonRate: 0.8,
      electronFlux: 0.75,
      bandgapVoltage: 1.12,
      atomicMode: 'photovoltaic',
      dayState: 'DAY',
      theme: 'dark',

      currentView: 'landing',

      setCurrentView: (view) => set({ currentView: view }),
      setZoomLevel: (level) => set({ zoomLevel: level }),
      selectNode: (id) => set({ selectedNodeId: id }),
      selectComponent: (id) => set({ selectedComponentId: id }),

      addPacket: (packet) => set((s) => ({ packets: [...s.packets, packet] })),
      removePacket: (id) => set((s) => ({ packets: s.packets.filter((p) => p.id !== id) })),

      executeTrade: (seller, buyer, amount, price) => {
        const trade: Trade = {
          id: `trade_${tradeId++}`,
          seller, buyer, amount, price,
          timestamp: Date.now()
        }
        const colors = ['#00ffcc', '#ffaa00', '#ff4466', '#44aaff']
        const color = colors[Math.floor(Math.random() * colors.length)]
        
        const packet: EnergyPacket = {
          id: `pkt_${packetId++}`,
          fromId: seller,
          toId: buyer,
          amount,
          startTime: performance.now() / 1000,
          duration: 2.5,
          color
        }
        get().addPacket(packet)

        set((s) => ({
          trades: [trade, ...s.trades].slice(0, 20),
          gridEnergy: s.gridEnergy + amount * 0.1,
          xp: s.xp + Math.round(amount * 5) // Award XP for every trade
        }))
      },

      awardXP: (amount) => set((s) => ({ xp: s.xp + amount })),


      toggleMarketplace: () => set((s) => ({ marketplaceOpen: !s.marketplaceOpen })),
      setWeatherIntensity: (val) => set({ weatherIntensity: val }),
      setTimeOfDay: (t) => {
        const { weatherIntensity } = get()
        const solarFactor = Math.max(0, Math.sin((t - 6) / 12 * Math.PI)) * (1 - weatherIntensity * 0.7)
        set((s) => ({
          timeOfDay: t,
          photonRate: solarFactor,
          nodes: s.nodes.map(n =>
            n.type === 'solar_farm'
              ? { ...n, production: Math.round(850 * solarFactor + Math.random() * 50), temperature: 22 + 25 * solarFactor }
              : n
          )
        }))
      },

      updateNodeTemperature: (id, temp) => set((s) => ({
        nodes: s.nodes.map(n => n.id === id ? { ...n, temperature: temp } : n)
      })),
      updateNodeHealth: (id, health) => set((s) => ({
        nodes: s.nodes.map(n => n.id === id ? { ...n, health } : n)
      })),
      toggleNode: (id) => set((s) => ({
        nodes: s.nodes.map(n => n.id === id ? { ...n, active: !n.active } : n)
      })),

      setPanelTilt: (deg) => set({ panelTilt: deg }),
      setSoilingFactor: (f) => set({ soilingFactor: f }),
      setInverterLoad: (l) => set({ inverterLoad: l }),
      setPhotonRate: (r) => set({ photonRate: r, electronFlux: r * 0.85 }),
      setAtomicMode: (mode) => set({ atomicMode: mode }),

      addWindTurbine: (position) => {
        const id = `w${nodeId++}`
        const newNode: EnergyNode = {
          id, type: 'wind', position,
          label: `Wind Turbine ${nodeId}`,
          production: 200 + Math.random() * 300,
          health: 1.0,
          temperature: 25,
          active: true
        }
        set((s) => ({ nodes: [...s.nodes, newNode] }))
      },

      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      tick: (dt, elapsedTime) => {
        const { packets, timeOfDay, nodes } = get()
        
        // Clean up expired packets - identify all at once
        const expiredIds = packets
          .filter(p => elapsedTime - p.startTime >= p.duration)
          .map(p => p.id)

        // Accumulate CO2 offset based on clean production
        const cleanProd = nodes.reduce((acc, n) => (n.active && (n.type === 'solar_farm' || n.type === 'wind')) ? acc + n.production : acc, 0)
        const nextTimeOfDay = (timeOfDay + dt * 0.05) % 24
        
        // Update dayState based on time
        let ds: DayState = 'DAY'
        if (nextTimeOfDay > 17 || nextTimeOfDay < 6) ds = 'NIGHT'
        else if (nextTimeOfDay > 16 || nextTimeOfDay < 7) ds = 'DUSK'

        // Optimization: Only trigger a React update if packets changed OR every ~100ms for stats
        const shouldUpdateUI = Math.floor(elapsedTime * 10) !== Math.floor((elapsedTime - dt) * 10)
        const dayStateChanged = ds !== get().dayState

        if (expiredIds.length > 0 || shouldUpdateUI || dayStateChanged) {
          set((s) => ({
            packets: expiredIds.length > 0 ? s.packets.filter(p => !expiredIds.includes(p.id)) : s.packets,
            co2Offset: s.co2Offset + (cleanProd / 3600) * dt * 0.5,
            timeOfDay: nextTimeOfDay,
            dayState: ds
          }))
        }
      }

    }),
    {
      name: 'solar-chain-storage',
      partialize: (state) => ({ 
        nodes: state.nodes, 
        gridEnergy: state.gridEnergy, 
        co2Offset: state.co2Offset,
        panelTilt: state.panelTilt,
        soilingFactor: state.soilingFactor,
        xp: state.xp
      }),
    }
  )
)

