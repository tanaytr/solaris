import React, { useState } from 'react'
import { useSimStore, type EnergyNode } from '../../store/useSimStore'

export const MarketplaceEngine: React.FC = () => {
  const { 
    nodes, xp, executeTrade, awardXP, setCurrentView, theme,
    isLoggedIn, setLoggedIn, autoTradeEnabled, toggleAutoTrade,
    addUserNode, manualTradeMode, setManualTradeMode, userNodeId,
    toggleMarketplace
  } = useSimStore()
  
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [userName, setUserName] = useState('')
  const [userSource, setUserSource] = useState<'solar_farm' | 'wind' | 'biogas'>('solar_farm')
  const [userProd, setUserProd] = useState(500)
  const [userUsage, setUserUsage] = useState(300)
  const [isFetching, setIsFetching] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'market' | 'investment'>('market')

  const { upgradeNode } = useSimStore()

  const finishOnboarding = () => {
    addUserNode({
      type: userSource,
      label: userName || 'User Facility',
      production: userProd - userUsage
    })
    setLoggedIn(true)
  }

  const handleManualFetch = () => {
    setIsFetching(true)
    setTimeout(() => setIsFetching(false), 1200)
  }

  if (!isLoggedIn) {
     return (
       <div style={{ 
         position: 'fixed', inset: 0, zIndex: 9999, 
         display: 'flex', alignItems: 'center', justifyContent: 'center',
         background: 'rgba(2, 4, 8, 0.4)', backdropFilter: 'blur(16px)'
       }}>
            <div style={{ 
              width: 500, padding: 48, background: 'rgba(15, 23, 42, 0.85)', 
              borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', borderTop: '6px solid #00ffaa',
              textAlign: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
              animation: 'onboardingFade 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative'
            }}>
               <button onClick={toggleMarketplace} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', opacity: 0.5 }}>×</button>
               {onboardingStep === 0 && (
                 <div style={{ animation: 'onboardingFade' }}>
                    <div className="outfit" style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>SYSTEM_INIT</div>
                    <p style={{ opacity: 0.5, fontSize: 10, fontFamily: 'Space Mono', letterSpacing: 3, marginBottom: 40 }}>STEP_01 // DEFINE_SYSTEM_ALIAS</p>
                    <input 
                      type="text" placeholder="Enter Facility Name..." 
                      value={userName} onChange={e => setUserName(e.target.value)}
                      style={{ width: '100%', padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, color: '#fff', fontSize: 16, marginBottom: 32, outline: 'none' }}
                    />
                    <button onClick={() => setOnboardingStep(1)} style={{ width: '100%', padding: '20px', background: '#00ffaa', border: 'none', color: '#000', borderRadius: 16, fontWeight: 900, fontSize: 12, cursor: 'pointer', boxShadow: '0 0 20px rgba(0,255,170,0.3)' }}>PROCEED_TO_ARCHITECTURE</button>
                 </div>
               )}

               {onboardingStep === 1 && (
                 <div style={{ animation: 'onboardingFade' }}>
                    <div className="outfit" style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>CORE_ARCHITECTURE</div>
                    <p style={{ opacity: 0.5, fontSize: 10, fontFamily: 'Space Mono', marginBottom: 40 }}>STEP_02 // SELECT_ENERGY_HARVESTER</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 40 }}>
                       {(['solar_farm', 'wind', 'biogas'] as const).map(s => (
                         <div 
                           key={s} onClick={() => setUserSource(s)}
                           style={{ 
                             padding: '24px 10px', borderRadius: 20, cursor: 'pointer',
                             border: `2px solid ${userSource === s ? '#00ffaa' : 'rgba(255,255,255,0.05)'}`,
                             background: userSource === s ? 'rgba(0,255,170,0.1)' : 'transparent',
                             transition: 'all 0.3s'
                           }}
                         >
                           <div style={{ fontSize: 32, marginBottom: 12 }}>{s === 'solar_farm' ? '☀️' : s === 'wind' ? '🌬️' : '🔋'}</div>
                           <div style={{ fontSize: 10, fontWeight: 800 }}>{s.toUpperCase()}</div>
                         </div>
                       ))}
                    </div>
                    <button onClick={() => setOnboardingStep(2)} style={{ width: '100%', padding: '20px', background: '#00ffaa', border: 'none', color: '#000', borderRadius: 16, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}>CONFIGURE_METRICS</button>
                 </div>
               )}

               {onboardingStep === 2 && (
                 <div style={{ animation: 'onboardingFade' }}>
                    <div className="outfit" style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>SYSTEM_METRICS</div>
                    <p style={{ opacity: 0.5, fontSize: 10, fontFamily: 'Space Mono', marginBottom: 40 }}>STEP_03 // LOAD_PROFILING</p>
                    <div style={{ textAlign: 'left', marginBottom: 24 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                          <span style={{ fontSize: 11, opacity: 0.5 }}>AVG_PRODUCTION</span>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#00ffaa' }}>{userProd} kWh</span>
                       </div>
                       <input type="range" min="100" max="2000" step="50" value={userProd} onChange={e => setUserProd(parseInt(e.target.value))} style={{ width: '100%' }} />
                    </div>
                    <div style={{ textAlign: 'left', marginBottom: 40 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                          <span style={{ fontSize: 11, opacity: 0.5 }}>AVG_CONSUMPTION</span>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#ef4444' }}>{userUsage} kWh</span>
                       </div>
                       <input type="range" min="50" max="1500" step="50" value={userUsage} onChange={e => setUserUsage(parseInt(e.target.value))} style={{ width: '100%' }} />
                    </div>
                    <button onClick={() => setOnboardingStep(3)} style={{ width: '100%', padding: '20px', background: '#00ffaa', border: 'none', color: '#000', borderRadius: 16, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}>FINAL_SYNCHRONIZATION</button>
                 </div>
               )}

               {onboardingStep === 3 && (
                 <div style={{ animation: 'onboardingFade' }}>
                    <div className="outfit" style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>NETWORK_LINK</div>
                    <p style={{ opacity: 0.5, fontSize: 10, fontFamily: 'Space Mono', marginBottom: 40 }}>STEP_04 // SECURE_SETTLEMENT_GATEWAY</p>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16, marginBottom: 16, textAlign: 'left', border: '1px solid rgba(255,255,255,0.08)' }}>
                       <div style={{ fontSize: 9, opacity: 0.4 }}>UPI_SETTLEMENT</div>
                       <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Space Mono' }}>solaris.{userName.toLowerCase().replace(/\s/g, '')}@okicici</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16, marginBottom: 40, textAlign: 'left', border: '1px solid rgba(255,255,255,0.08)' }}>
                       <div style={{ fontSize: 9, opacity: 0.4 }}>ENCRYPTION_LAYER</div>
                       <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Space Mono' }}>AES-256 QUADRA-SYNC</div>
                    </div>
                    <button onClick={finishOnboarding} style={{ width: '100%', padding: '20px', background: '#0ea5e9', border: 'none', color: '#fff', borderRadius: 16, fontWeight: 900, fontSize: 12, cursor: 'pointer', boxShadow: '0 10px 30px rgba(14,165,233,0.4)' }}>AUTHORIZE_GRID_LINK</button>
                 </div>
               )}
            </div>
         <style>{`
            @keyframes onboardingFade { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
         `}</style>
       </div>
     )
  }

  const stations = nodes.filter(n => (n.type === 'solar_farm' || n.type === 'wind' || n.type === 'biogas') && n.active && n.id !== userNodeId)
  const level = Math.floor(xp / 1000) + 1
  const progress = (xp % 1000) / 10
  const xpToNext = 1000 - (xp % 1000)

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: 'rgba(2, 4, 8, 0.4)', backdropFilter: 'blur(16px)', padding: '60px 80px', position: 'relative' }}>
      <button onClick={toggleMarketplace} style={{ position: 'absolute', top: 40, right: 40, background: 'none', border: 'none', color: '#fff', fontSize: 32, cursor: 'pointer', zIndex: 100, opacity: 0.6 }}>×</button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, pointerEvents: 'all' }}>
        <div>
          <div className="outfit" style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-1.5px', color: '#fff' }}>MARKET_MANAGER</div>
          <div className="mono" style={{ fontSize: '11px', opacity: 0.5, letterSpacing: '4px', marginTop: 8, color: '#00ffaa' }}>PRO_TRADING_PROTOCOL / v4.9.0</div>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', gap: 40 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ textAlign: 'right' }}>
                 <div className="mono" style={{ fontSize: '9px', opacity: 0.4 }}>FETCH_MODE</div>
                 <div style={{ fontSize: '13px', fontWeight: 800, color: manualTradeMode ? '#0ea5e9' : '#555' }}>{manualTradeMode ? 'MANUAL_DISPATCH' : 'AI_PASSIVE'}</div>
              </div>
              <button 
                onClick={() => setManualTradeMode(!manualTradeMode)}
                style={{ height: 44, padding: '0 24px', background: manualTradeMode ? '#0ea5e9' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: manualTradeMode ? '#fff' : '#888', borderRadius: 12, fontSize: 10, fontWeight: 900, cursor: 'pointer', transition: 'all 0.3s' }}
              >
                TOGGLE_MANUAL
              </button>
           </div>
           <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
                <div style={{ fontSize: '13px', fontWeight: 800 }}>LVL {level}</div>
                <div style={{ width: 140, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: '#00ffaa' }} />
                </div>
              </div>
              <div className="mono" style={{ fontSize: '10px', opacity: 0.4 }}>{xpToNext} XP TO NEXT</div>
           </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 32, marginBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 20, pointerEvents: 'all' }}>
          <button 
            onClick={() => setActiveTab('market')}
            style={{ 
              background: 'none', border: 'none', color: activeTab === 'market' ? '#00ffaa' : '#888', 
              fontSize: 14, fontWeight: 900, cursor: 'pointer', opacity: activeTab === 'market' ? 1 : 0.5,
              borderBottom: activeTab === 'market' ? '2px solid #00ffaa' : 'none', padding: '0 0 10px 0',
              transition: 'all 0.3s'
            }}
          >
            MARKET_DISPATCH
          </button>
          <button 
            onClick={() => setActiveTab('investment')}
            style={{ 
              background: 'none', border: 'none', color: activeTab === 'investment' ? '#00ffaa' : '#888', 
              fontSize: 14, fontWeight: 900, cursor: 'pointer', opacity: activeTab === 'investment' ? 1 : 0.5,
              borderBottom: activeTab === 'investment' ? '2px solid #00ffaa' : 'none', padding: '0 0 10px 0',
              transition: 'all 0.3s'
            }}
          >
            INVESTMENT_HUB
          </button>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 60, overflow: 'hidden', pointerEvents: 'all' }}>
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 20 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
              <h2 className="outfit" style={{ fontSize: 22, fontWeight: 800 }}>
                {activeTab === 'market' ? (manualTradeMode ? 'SCAN_RESULTS' : 'ACTIVE_PRODUCERS') : 'FACILITY_MATRIX'}
              </h2>
              {activeTab === 'market' && manualTradeMode && (
                <button 
                  onClick={handleManualFetch} disabled={isFetching}
                  style={{ height: 40, padding: '0 24px', background: 'rgba(0, 255, 170, 0.1)', border: '1px solid #00ffaa', borderRadius: 12, color: '#00ffaa', fontWeight: 900, fontSize: 10, cursor: 'pointer' }}
                >
                  {isFetching ? 'SCANNING...' : 'SCAN_OFFERS'}
                </button>
              )}
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, opacity: isFetching ? 0.2 : 1, transition: 'opacity 0.4s' }}>
              {activeTab === 'market' ? (
                stations.map(node => (
                  <div 
                    key={node.id} onClick={() => setSelectedSeller(node.id)}
                    style={{ 
                      padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', 
                      background: selectedSeller === node.id ? 'rgba(0,255,170,0.1)' : 'rgba(15, 23, 42, 0.6)',
                      borderColor: selectedSeller === node.id ? '#00ffaa' : 'rgba(255,255,255,0.08)',
                      transition: 'all 0.3s', cursor: 'pointer', position: 'relative'
                    }}
                  >
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <span className="mono" style={{ fontSize: 9, color: '#00ffaa' }}>{node.type.toUpperCase()}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.6 }}>{Math.round(node.health * 100)}% REL.</span>
                     </div>
                     <div className="outfit" style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>{node.label}</div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
                        <div>
                           <div style={{ fontSize: 9, opacity: 0.5, marginBottom: 4 }}>YIELD</div>
                           <div style={{ fontWeight: 800, fontSize: 16 }}>{Math.round(node.production)} kWh</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                           <div style={{ fontSize: 9, opacity: 0.5, marginBottom: 4 }}>TEMP</div>
                           <div style={{ fontWeight: 800, fontSize: 16 }}>{node.temperature.toFixed(1)}°C</div>
                        </div>
                     </div>
                     {manualTradeMode && selectedSeller === node.id && (
                       <button 
                         onClick={(e) => { 
                           e.stopPropagation(); 
                           if(userNodeId) {
                             executeTrade(node.id, userNodeId, 50, 0); 
                             awardXP(50);
                           } 
                         }}
                         style={{ width: '100%', marginTop: 24, height: 48, background: '#00ffaa', border: 'none', borderRadius: 12, color: '#000', fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
                       >
                         LINK_SETTLEMENT
                       </button>
                     )}
                  </div>
                ))
              ) : (
                nodes.filter(n => n.type !== 'marketplace').map(node => {
                  const canUpgrade = xp >= 1000
                  const isUpgraded = node.level > 1
                  const dividend = node.level * 0.5
                  
                  return (
                    <div 
                      key={node.id} onClick={() => setSelectedSeller(node.id)}
                      style={{ 
                        padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', 
                        background: selectedSeller === node.id ? 'rgba(0,165,233,0.1)' : 'rgba(15, 23, 42, 0.6)',
                        borderColor: selectedSeller === node.id ? '#0ea5e9' : (isUpgraded ? 'rgba(0, 255, 170, 0.3)' : 'rgba(255,255,255,0.08)'),
                        boxShadow: isUpgraded ? '0 0 20px rgba(0,255,170,0.05)' : 'none',
                        transition: 'all 0.3s', cursor: 'pointer', position: 'relative'
                      }}
                    >
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                          <span className="mono" style={{ fontSize: 9, color: node.id === userNodeId ? '#00ffaa' : '#0ea5e9' }}>
                            {node.id === userNodeId ? 'SOURCE_NODE' : 'GRID_FACILITY'}
                          </span>
                          <div style={{ background: '#00ffaa', color: '#000', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 900 }}>LVL {node.level}</div>
                       </div>
                       
                       <div className="outfit" style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>{node.label}</div>
                       <p className="mono" style={{ fontSize: 9, opacity: 0.4, marginBottom: 24 }}>TYPE: {node.type.toUpperCase()}</p>
                       
                       <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, marginBottom: 24 }}>
                          <div>
                             <div style={{ fontSize: 9, opacity: 0.5, marginBottom: 4 }}>TOTAL_STAKED</div>
                             <div style={{ fontWeight: 800, fontSize: 14 }}>{node.investedXP} XP</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                             <div style={{ fontSize: 9, opacity: 0.5, marginBottom: 4 }}>PASSIVE_YIELD</div>
                             <div style={{ fontWeight: 800, fontSize: 14, color: '#00ffaa' }}>+{dividend} XP / 2s</div>
                          </div>
                       </div>
                       
                       <button 
                         disabled={!canUpgrade}
                         onClick={(e) => { 
                           e.stopPropagation(); 
                           upgradeNode(node.id, 1000);
                         }}
                         style={{ 
                           width: '100%', height: 48, 
                           background: canUpgrade ? '#0ea5e9' : 'rgba(255,255,255,0.05)', 
                           border: 'none', borderRadius: 12, color: canUpgrade ? '#fff' : '#444', 
                           fontWeight: 900, fontSize: 11, cursor: canUpgrade ? 'pointer' : 'not-allowed',
                           transition: 'all 0.3s'
                         }}
                       >
                         {canUpgrade ? 'STAKE_1000_XP' : 'INSUFFICIENT_CREDITS'}
                       </button>
                    </div>
                  )
                })
              )}
           </div>
        </div>

        <div style={{ width: 400, paddingLeft: 60, borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
           <h2 className="outfit" style={{ fontSize: 22, fontWeight: 800, marginBottom: 40 }}>
             {activeTab === 'market' ? 'GRID_LEDGER' : 'INVESTMENT_LEDGER'}
           </h2>
           
           <div style={{ background: activeTab === 'market' ? 'rgba(0, 255, 170, 0.05)' : 'rgba(14, 165, 233, 0.05)', padding: 40, borderRadius: 28, border: activeTab === 'market' ? '1px solid rgba(0, 255, 170, 0.15)' : '1px solid rgba(14, 165, 233, 0.15)', marginBottom: 24 }}>
              <div className="mono" style={{ fontSize: 10, opacity: 0.5, marginBottom: 12 }}>TOTAL_CREDITS</div>
              <div className="outfit" style={{ fontSize: 56, fontWeight: 900, color: activeTab === 'market' ? '#00ffaa' : '#0ea5e9' }}>{Math.floor(xp)}</div>
              {activeTab === 'investment' && (
                <div className="mono" style={{ fontSize: 9, color: '#00ffaa', marginTop: 12, fontWeight: 700 }}>
                  EST_PASSIVE: +{nodes.reduce((acc, n) => acc + (n.level * 0.5), 0).toFixed(1)} XP / 2s
                </div>
              )}
           </div>
           
           <div style={{ flex: 1, overflowY: 'auto' }}>
              {activeTab === 'market' ? (
                <div style={{ padding: 24, borderRadius: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <div className="mono" style={{ fontSize: 9, opacity: 0.5, marginBottom: 12 }}>SOURCE_FACILITY</div>
                   <div style={{ fontSize: 18, fontWeight: 900 }}>{nodes.find(n => n.id === userNodeId)?.label || 'AWAITING_SYNC'}</div>
                   <div style={{ fontSize: 11, opacity: 0.4, marginTop: 4 }}>ID_PRIMARY_LINK_0x82...</div>
                </div>
              ) : (
                <div style={{ padding: 24, borderRadius: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <div className="mono" style={{ fontSize: 9, opacity: 0.5, marginBottom: 20 }}>GRID_BENEFACTORS</div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {[
                        { name: 'Grid_Sentinel_01', val: '124,500' },
                        { name: 'Energy_Baron', val: '98,200' },
                        { name: 'Solaris_Ops', val: '45,800' },
                        { name: 'User_4922', val: '31,200' },
                        { name: 'Mesh_Master', val: '12,400' }
                      ].map((b, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                              <span style={{ fontSize: 10, opacity: 0.3 }}>#{i+1}</span>
                              <span style={{ fontSize: 12, fontWeight: 700 }}>{b.name}</span>
                           </div>
                           <span style={{ fontSize: 10, fontWeight: 800, color: '#0ea5e9' }}>{b.val} XP</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>

           <button 
              onClick={toggleMarketplace}
              style={{ width: '100%', height: 64, background: 'rgba(255,255,255,1)', color: '#000', border: 'none', borderRadius: 20, fontWeight: 900, fontSize: 12, cursor: 'pointer', marginTop: 24 }}
           >
              CLOSE_MANAGER
           </button>
        </div>
      </div>
    </div>
  )
}
