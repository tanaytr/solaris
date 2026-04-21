import React, { useState } from 'react'
import { useSimStore, type EnergyNode } from '../../store/useSimStore'

export const MarketplaceEngine: React.FC = () => {
  const { nodes, xp, executeTrade, awardXP, setCurrentView, theme } = useSimStore()
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null)
  
  // Define stations (sellers are Solar/Wind nodes with active production)
  const stations = nodes.filter(n => (n.type === 'solar_farm' || n.type === 'wind') && n.active)
  // Consumers (houses or industrial zones)
  const consumers = nodes.filter(n => n.type === 'house' || n.type === 'marketplace')

  const handleSell = (sellerId: string, buyerId: string, amount: number) => {
    executeTrade(sellerId, buyerId, amount, 0)
    // Award bonus XP for successful management
    awardXP(100)
    
    // Success effect
    const btn = document.getElementById(`sell-btn-${buyerId}`)
    if (btn) {
      btn.classList.add('pulse-success')
      setTimeout(() => btn.classList.remove('pulse-success'), 1000)
    }
  }

  const level = Math.floor(xp / 1000) + 1
  const xpToNext = (level * 1000) - xp
  const progress = ((xp % 1000) / 1000) * 100

  return (
    <div className={`marketplace-engine theme-${theme}`}>
      <style>{`
        .marketplace-engine {
          width: 100vw; height: 100vh;
          background: radial-gradient(circle at 50% 50%, #0a0c14 0%, #000 100%);
          color: #fff; padding: 40px; display: flex; flex-direction: column; overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }
        .market-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .xp-bar-container { width: 400px; height: 12px; background: rgba(255,255,255,0.1); border-radius: 6px; position: relative; overflow: hidden; }
        .xp-progress { height: 100%; background: linear-gradient(90deg, #00ffaa, #0ea5e9); transition: width 0.5s ease-out; }
        
        .station-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; flex: 1; overflow-y: auto; padding-bottom: 40px; }
        .station-card {
          background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px; padding: 24px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative; backdrop-filter: blur(20px);
        }
        .station-card.selected { border-color: #00ffaa; box-shadow: 0 0 30px rgba(0,255,170,0.2); transform: translateY(-5px); }
        .station-card:hover { border-color: rgba(0,255,170,0.5); }
        
        .badge { font-family: 'Space Mono'; font-size: 10px; padding: 4px 10px; border-radius: 100px; background: rgba(0,255,170,0.1); color: #00ffaa; font-weight: 700; margin-bottom: 12px; display: inline-block; }
        .val-large { font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 8px 0; }
        
        .consumer-list { margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); paddingTop: 20px; }
        .consumer-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 12px; }
        
        .sell-btn {
          background: #00ffaa; color: #000; border: none; padding: 8px 16px; border-radius: 8px;
          font-weight: 800; font-size: 11px; cursor: pointer; transition: all 0.2s;
        }
        .sell-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
        .sell-btn:disabled { opacity: 0.2; cursor: not-allowed; filter: grayscale(1); }
        
        .level-up-tag { position: absolute; top: -10px; right: 20px; background: #0ea5e9; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 900; box-shadow: 0 4px 12px rgba(14,165,233,0.3); }
        
        @keyframes pulseSuccess { 0% { transform: scale(1); background: #00ffaa; } 50% { transform: scale(1.1); background: #fff; } 100% { transform: scale(1); background: #00ffaa; } }
        .pulse-success { animation: pulseSuccess 0.5s ease-out; }
      `}</style>
      
      <header className="market-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button 
            onClick={() => setCurrentView('landing')}
            style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
              color: '#fff', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer',
              fontSize: '11px', fontWeight: 700 
            }}
          >
            ← BACK_TO_BASE
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 900 }}>ENERGY_EXCHANGE</h1>
            <p style={{ opacity: 0.5, fontSize: '11px', fontFamily: 'Space Mono' }}>SYSTEM_STATUS: ALL_GRIDS_OPERATIONAL</p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 8 }}>
            <div style={{ fontSize: '12px', fontWeight: 600 }}>PLAYER_LEVEL {level}</div>
            <div className="xp-bar-container">
              <div className="xp-progress" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div style={{ fontSize: '10px', opacity: 0.4, fontFamily: 'Space Mono' }}>{xpToNext} XP TO NEXT TIER</div>
        </div>
      </header>

      <div className="station-grid">
        {stations.map(station => (
          <div 
            key={station.id} 
            className={`station-card ${selectedSeller === station.id ? 'selected' : ''}`}
            onClick={() => setSelectedSeller(station.id)}
          >
            {selectedSeller === station.id && <div className="level-up-tag">SELECTING...</div>}
            <div className="badge">{station.type.toUpperCase()}</div>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{station.label}</h2>
            <div className="val-large" style={{ color: station.production > 0 ? '#00ffaa' : '#fb7185' }}>
              {Math.round(station.production)} <span style={{ fontSize: '14px', opacity: 0.5 }}>kWh</span>
            </div>
            
            <div className="consumer-list">
              <div style={{ fontSize: '10px', opacity: 0.4, marginBottom: 12, fontFamily: 'Space Mono' }}>CONNECTED_CONSUMERS</div>
              {consumers.map(consumer => {
                const canSell = selectedSeller === station.id && station.production > 10
                return (
                  <div key={consumer.id} className="consumer-row">
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>{consumer.label}</div>
                      <div style={{ fontSize: '9px', opacity: 0.5 }}>Demand: {Math.abs(Math.round(consumer.production))} kWh</div>
                    </div>
                    <button 
                      id={`sell-btn-${consumer.id}`}
                      className="sell-btn"
                      disabled={!canSell}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSell(station.id, consumer.id, 50)
                      }}
                    >
                      SELL_50_ST
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 0', display: 'flex', justifyContent: 'center' }}>
         <div style={{ display: 'flex', gap: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', opacity: 0.4, marginBottom: 4 }}>TOTAL_XP_EARNED</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#00ffaa' }}>{xp.toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', opacity: 0.4, marginBottom: 4 }}>ACTIVE_STATIONS</div>
              <div style={{ fontSize: '20px', fontWeight: 900 }}>{stations.length}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', opacity: 0.4, marginBottom: 4 }}>NETWORK_HEALTH</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#0ea5e9' }}>EXCELLENT</div>
            </div>
         </div>
      </footer>
    </div>
  )
}
