import React from 'react'

export interface Slide {
  title: string
  subtitle: string
  content: (subStep: number) => React.ReactNode
  maxSubSteps?: number
}

export const getSlides = (simStats?: { gridEnergy: number; co2Offset: number }): Slide[] => [
  {
    title: "The Solaris Manifesto",
    subtitle: "A Neural Network for Energy Sovereignty",
    content: () => (
      <div className="tech-slide">
        <div className="content-grid">
          <div className="text-block">
            <p className="outfit" style={{ fontSize: '1.5rem', lineHeight: '1.6', fontWeight: 300 }}>
              SOLARIS is the world's first autonomous energy conductor. 
            </p>
            <p style={{ marginTop: '2rem', opacity: 0.7, fontSize: '1.1rem', lineHeight: '1.8' }}>
              We transform passive consumers into active "prosumers" in a global energy neural network. By bridging edge-compute hardware with high-frequency financial protocols, Solaris enables energy to flow with the same speed and transparency as digital data.
            </p>
            <div className="hero-stats">
              <div className="hero-stat-card">
                <span className="val" style={{ color: 'var(--accent-primary)' }}>1:1</span>
                <span className="lbl">Digital Twin Sync</span>
              </div>
              <div className="hero-stat-card">
                <span className="val" style={{ color: 'var(--accent-secondary)' }}>Atomic</span>
                <span className="lbl">P2P Settlement</span>
              </div>
            </div>
          </div>
          <div className="visual-block">
            <div className="isometric-card">
               <div className="card-glare" />
               <h4 className="mono" style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '1rem' }}>SYSTEM_MANIFESTO.LOG</h4>
               <ul className="manifesto-list">
                  <li>○ Zero-Trust Energy Provenance</li>
                  <li>○ High-Fidelity Infrastructure Sync</li>
                  <li>○ Autonomous Grid Optimization</li>
                  <li>○ Carbon Offset Tokenization</li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Hardware Topology",
    subtitle: "ESP32-S3 Nexus Integration",
    content: () => (
      <div className="tech-slide">
        <div className="content-grid reverse">
          <div className="visual-block">
            <div className="hardware-schematic">
              <div className="hub-node">
                <div className="pulse-ring" />
                <span className="mono">ESP32-S3</span>
              </div>
              <div className="bus-lines">
                <div className="line l1" />
                <div className="line l2" />
                <div className="line l3" />
              </div>
              <div className="peripheral adc">ADC</div>
              <div className="peripheral dma">DMA</div>
              <div className="peripheral rfm">RFM</div>
            </div>
          </div>
          <div className="text-block">
             <h3 className="outfit">The Nexus Hub</h3>
             <p style={{ opacity: 0.7, marginTop: '1rem', lineHeight: '1.7' }}>
               The physical layer utilizes the ESP32-S3 dual-core microcontroller. Core 0 handles the encrypted communication bridge, while Core 1 performs real-time power analysis.
             </p>
             <table className="studio-table" style={{ marginTop: '1.5rem' }}>
                <thead><tr><th>REGISTER</th><th>INTERFACE</th></tr></thead>
                <tbody>
                  <tr><td>ADC1_CH0</td><td>Solar Ingress (12-bit)</td></tr>
                  <tr><td>SPI_DMA_BUF</td><td>High-Speed Telemetry</td></tr>
                  <tr><td>I2C_ADDR_0x27</td><td>Status Feedback Matrix</td></tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Precision Telemetry",
    subtitle: "1000Hz Data Ingestion & DMA Buffering",
    content: () => (
      <div className="tech-slide">
        <div className="content-grid">
           <div className="text-block">
              <p className="outfit" style={{ fontSize: '1.3rem', lineHeight: '1.7' }}>
                Energy isn't static. It's a high-frequency waveform.
              </p>
              <p style={{ marginTop: '1rem', opacity: 0.6 }}>
                Solaris samples voltage and current differentials at 1000Hz using Direct Memory Access (DMA). This prevents CPU bottlenecking, allowing the system to detect sub-millisecond fluctuations in solar yield or grid demand.
              </p>
              <div className="code-editor" style={{ marginTop: '2rem' }}>
                <pre className="mono">
{`// ADC DMA Buffer Initialization
void init_energy_bus() {
  adc_dma_config_t config = {
    .sample_freq_hz = 1000,
    .conv_mode = ADC_CONV_SINGLE_UNIT_1,
    .format = ADC_DIGI_OUTPUT_FORMAT_TYPE1,
  };
  esp_adc_cal_characterize(ADC_UNIT_1, ...);
}`}
                </pre>
              </div>
           </div>
           <div className="visual-block">
              <div className="wave-monitor">
                 <div className="wave-trace" />
                 <div className="wave-overlay" />
                 <div className="scan-line" />
              </div>
              <p className="mono" style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.7rem', opacity: 0.4 }}>REAL-TIME_WAVEFORM_ANALYSIS</p>
           </div>
        </div>
      </div>
    )
  },
  {
    title: "State Synchronization",
    subtitle: "Zero-Trust LP-Link Protocol",
    content: () => (
      <div className="tech-slide">
        <div className="full-width-content">
           <div style={{ padding: '2rem', background: 'var(--panel-bg)', borderRadius: '24px', border: '1px solid var(--border-ui)' }}>
              <h4 className="outfit" style={{ marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>LP-Link Protocol Stack</h4>
              <div className="protocol-stack">
                 <div className="layer">APPLICATION: Energy Market Interface</div>
                 <div className="layer">SESSION: XTS-AES 256 Encrypted Tunnel</div>
                 <div className="layer">TRANSPORT: Deterministic Gossip Network</div>
                 <div className="layer">PHYSICAL: Wi-Fi 6 / LoRa Multi-Band</div>
              </div>
              <p style={{ marginTop: '2rem', opacity: 0.7, maxWidth: '800px', margin: '2rem auto 0' }}>
                Every data packet transmitted by a Solaris node is cryptographically signed and hashed. This ensures that energy production data cannot be spoofed, forming a bedrock of truth for the peer-to-peer energy marketplace.
              </p>
           </div>
        </div>
      </div>
    )
  },
  {
    title: "Digital Twin Fabric",
    subtitle: "High-Fidelity R3F Observability",
    content: () => (
      <div className="tech-slide">
        <div className="content-grid">
           <div className="visual-block">
              <div className="mesh-viz">
                 <div className="node n1" />
                 <div className="node n2" />
                 <div className="node n3" />
                 <div className="connection c1" />
                 <div className="connection c2" />
              </div>
           </div>
           <div className="text-block">
              <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                The Solaris Twin is more than a visualization—it is a 1:1 digital reflection of the physical grid state.
              </p>
              <p style={{ marginTop: '1.5rem', opacity: 0.6 }}>
                Using React Three Fiber and custom GLSL shaders, we represent thousands of concurrent energy transactions as physical flow lines. Each "photon" in the digital twin correlates to a validated energy packet in the physical network.
              </p>
           </div>
        </div>
      </div>
    )
  },
  {
    title: "Instanced Performance",
    subtitle: "Optimizing the 60FPS Experience",
    content: () => (
      <div className="tech-slide">
        <div className="content-grid reverse">
           <div className="visual-block">
              <div className="performance-chart">
                 <div className="bar" style={{ height: '95%' }}><span>Instancing</span></div>
                 <div className="bar" style={{ height: '30%' }}><span>Traditional</span></div>
              </div>
           </div>
           <div className="text-block">
              <h4 className="outfit">GPU-Accelerated Rendering</h4>
              <p style={{ marginTop: '1rem', opacity: 0.7 }}>
                To maintain a buttery smooth 60FPS while simulating a complex grid, we utilize <b>Instanced Mesh Rendering</b>. This offloads the transformation of thousands of energy packets to the GPU, significantly reducing the CPU overhead and preventing "AI slop" or interface lag.
              </p>
              <div className="mono-label" style={{ marginTop: '2rem' }}>BUFFER_SYNC: SUCCESSFUL</div>
           </div>
        </div>
      </div>
    )
  },
  {
    title: "Grid Economics",
    subtitle: "CPMM: Constant-Product Market Making",
    content: () => (
      <div className="tech-slide">
        <div className="content-grid">
           <div className="text-block">
              <p className="outfit" style={{ fontSize: '1.4rem' }}>Energy Liquidity Pools</p>
              <p style={{ marginTop: '1rem', opacity: 0.7, lineHeight: '1.7' }}>
                Solaris adapts DeFi liquidity logic to energy pricing. The <b>x * y = k</b> formula ensures that energy price adjusts dynamically based on local supply (solar yield) and demand (appliance load).
              </p>
              <div className="math-box" style={{ marginTop: '2rem', padding: '1.5rem', background: '#000', borderRadius: '12px', border: '1px solid var(--accent-primary)' }}>
                 <p className="mono" style={{ color: 'var(--accent-primary)', fontSize: '1.2rem' }}>P = Δy / Δx</p>
                 <p style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.5rem' }}>Dynamic Price Discovery Algorithm</p>
              </div>
           </div>
           <div className="visual-block">
              <div className="amm-graphic">
                 <div className="supply-pool">840 kWh</div>
                 <div className="market-price">0.042 SOL</div>
                 <div className="demand-pool">210 kWh</div>
              </div>
           </div>
        </div>
      </div>
    )
  },
  {
    title: "P2P Transaction Flow",
    subtitle: "Atomic Real-Time Settlement",
    content: () => (
      <div className="tech-slide">
        <table className="studio-table">
          <thead>
            <tr><th>STAGE</th><th>ACTION</th><th>PROTOCOL</th></tr>
          </thead>
          <tbody>
            <tr><td>IDENTIFICATION</td><td>Edge nodes signal excess capacity</td><td>LP-Gossip</td></tr>
            <tr><td>MATCHING</td><td>AMM identifies highest-need consumer</td><td>Solaris-DEX</td></tr>
            <tr><td>TRANSFER</td><td>Physical energy routing through grid</td><td>L2-Mesh</td></tr>
            <tr><td>SETTLEMENT</td><td>Instant balance update & CO2 logging</td><td>Atomic-Sync</td></tr>
          </tbody>
        </table>
      </div>
    )
  },
  {
    title: "Measurable Impact",
    subtitle: "Carbon Provenance & ROI Metrics",
    content: () => (
      <div className="tech-slide">
        <div className="hero-stats" style={{ justifyContent: 'space-around' }}>
           <div className="hero-stat-card large">
              <span className="val">{simStats ? Math.round(simStats.co2Offset) : 0}kg</span>
              <span className="lbl">TOTAL CO2 AVOIDANCE</span>
           </div>
           <div className="hero-stat-card large">
              <span className="val" style={{ color: 'var(--accent-secondary)' }}>{simStats ? Math.round(simStats.gridEnergy) : 0}</span>
              <span className="lbl">NETWORK THROUGHPUT</span>
           </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.5, maxWidth: '600px', margin: '3rem auto 0', lineHeight: '1.6' }}>
          Every kilowatt-hour generated and traded on the Solaris network is linked to its carbon origin, providing immutable verification of sustainable energy use.
        </p>
      </div>
    )
  },
  {
    title: "Global Scalability",
    subtitle: "From Microgrid to Planetary Fabric",
    content: () => (
      <div className="tech-slide">
        <div className="visual-block" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div className="globe-mesh">
              <div className="lat-lines" />
              <div className="long-lines" />
              <div className="glow-aura" />
           </div>
        </div>
        <p className="outfit" style={{ textAlign: 'center', fontSize: '1.2rem', opacity: 0.8 }}>
          Solaris nodes form a decentralized mesh that scale infinitely. From a single solar-powered home to a continental industrial grid, the architecture remains the same.
        </p>
      </div>
    )
  },
  {
    title: "The Roadmap",
    subtitle: "Blackwell Integration & Phase 2",
    content: () => (
      <div className="tech-slide">
        <div className="timeline">
           <div className="time-node">
              <span className="year">2025</span>
              <span className="desc">Nexus S3 Global Deployment</span>
           </div>
           <div className="time-node active">
              <span className="year">2026</span>
              <span className="desc">Solaris Digital Twin Beta</span>
           </div>
           <div className="time-node">
              <span className="year">2027</span>
              <span className="desc">Blackwell GB200 Super-Sync</span>
           </div>
        </div>
      </div>
    )
  },
  {
    title: "System Lifecycle",
    subtitle: "From Photon to Settlement",
    maxSubSteps: 3,
    content: (step) => (
      <div className="story-studio">
        <div className="story-stage-container">
          <div className="visual-block">
            <svg viewBox="0 0 600 300" className="svg-graphic">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="var(--accent-primary)" />
                   <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
              </defs>
              <g className={`node-grp ${step >= 0 ? 'active' : ''}`}>
                <circle cx="100" cy="150" r="10" fill="var(--accent-primary)" />
                <text x="100" y="180" textAnchor="middle" fill="var(--text-main)" fontSize="10" fontWeight="700">NODE ALPHA</text>
              </g>
              <g className={`node-grp ${step >= 2 ? 'active' : ''}`}>
                <circle cx="500" cy="150" r="10" fill="var(--accent-secondary)" />
                <text x="500" y="180" textAnchor="middle" fill="var(--text-main)" fontSize="10" fontWeight="700">CONSUMER 01</text>
              </g>
              <path d="M 120 150 L 480 150" stroke="var(--border-ui)" strokeWidth="2" strokeDasharray="6,6" fill="none" />
              {step >= 2 && (
                <circle r="5" fill="var(--accent-primary)">
                  <animateMotion path="M 120 150 L 480 150" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              {step >= 1 && (
                 <circle cx="100" cy="150" r="30" fill="none" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.3">
                    <animate attributeName="r" from="10" to="60" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.3" to="0" dur="1s" repeatCount="indefinite" />
                 </circle>
              )}
            </svg>
          </div>
          <div className="narrative-box">
             {step === 0 && (
               <div>
                  <h5>1. PHOTON CAPTURE</h5>
                  <p>Edge hardware detects a surge in photovoltaic production. Local state is hashed and finalized for the next epoch.</p>
               </div>
             )}
             {step === 1 && (
               <div>
                  <h5>2. INTENT BROADCAST</h5>
                  <p>The Nexus node (ESP32-S3) broadcasts a sell-intent. Neighboring nodes react to the price discovery curve within milliseconds.</p>
               </div>
             )}
             {step === 2 && (
               <div>
                  <h5>3. OPTIMIZED TRANSFER</h5>
                  <p>Energy is routed through the path of least resistance. Transmission loss is practically eliminated by using local neighbors.</p>
               </div>
             )}
             {step >= 3 && (
               <div>
                  <h5>4. ATOMIC SETTLEMENT</h5>
                  <p>Transaction confirmed. Wallet balances adjusted. Total CO2 savings are immutable recorded on the global ledger.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    )
  }
]
